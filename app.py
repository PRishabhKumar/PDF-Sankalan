from flask import Flask, render_template, request, send_file, flash, redirect, url_for
import os
import PyPDF2
from werkzeug.utils import secure_filename
import io
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this in production

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB max file size

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def merge_pdfs(pdf_files):
    """Merge multiple PDF files into one"""
    merger = PyPDF2.PdfMerger()
    
    for pdf_file in pdf_files:
        try:
            merger.append(pdf_file)
        except Exception as e:
            print(f"Error merging {pdf_file}: {str(e)}")
            continue
    
    # Create output buffer
    output_buffer = io.BytesIO()
    merger.write(output_buffer)
    merger.close()
    output_buffer.seek(0)
    
    return output_buffer

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files:
        flash('No files selected', 'error')
        return redirect(url_for('index'))
    
    files = request.files.getlist('files')
    
    if not files or all(file.filename == '' for file in files):
        flash('No files selected', 'error')
        return redirect(url_for('index'))
    
    # Validate files
    valid_files = []
    for file in files:
        if file and allowed_file(file.filename):
            if file.content_length and file.content_length > MAX_FILE_SIZE:
                flash(f'File {file.filename} is too large. Maximum size is 16MB.', 'error')
                continue
            valid_files.append(file)
        else:
            flash(f'File {file.filename} is not a valid PDF', 'error')
    
    if not valid_files:
        flash('No valid PDF files found', 'error')
        return redirect(url_for('index'))
    
    if len(valid_files) < 2:
        flash('Please select at least 2 PDF files to merge', 'error')
        return redirect(url_for('index'))
    
    try:
        # Save files temporarily
        temp_files = []
        for file in valid_files:
            filename = secure_filename(file.filename)
            temp_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(temp_path)
            temp_files.append(temp_path)
        
        # Merge PDFs
        merged_pdf = merge_pdfs(temp_files)
        
        # Clean up temporary files
        for temp_file in temp_files:
            try:
                os.remove(temp_file)
            except:
                pass
        
        # Generate output filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f"merged_pdf_{timestamp}.pdf"
        
        return send_file(
            merged_pdf,
            as_attachment=True,
            download_name=output_filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        flash(f'Error merging PDFs: {str(e)}', 'error')
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
