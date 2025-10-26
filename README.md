<<<<<<< HEAD
# 📚 PDF Sankalan  
**PDF Sankalan** (संकलन = *collection or compilation*) is a lightweight and easy-to-use web app that helps you **merge multiple PDF files into one unified document** — quickly, securely, and effortlessly.  

Built with ❤️ in India 🇮🇳, PDF Sankalan is made for students, professionals, and anyone who works with PDFs every day.  

---

## 🚀 Features  
✅ Merge multiple PDF files in seconds  
✅ Clean and minimal user interface  
✅ Works directly in your browser — no installation needed  
✅ Fast, safe, and completely free  
✅ Cross-platform support  

---

## 🧰 Tech Stack  
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python (Flask)  
- **Libraries:** PyPDF2 (or pdf-merger, pdf-lib)  

---

## ⚙️ Installation & Setup  

### 1. Clone the Repository  
```bash
git clone https://github.com/your-username/pdf-sankalan.git
```
```bash
cd pdf-sankalan
```
 ### 2. Create a Virtual Environment (optional but recommended)
 ```bash
python -m venv venv
```
```bash
source venv/bin/activate   # On Linux/Mac
```
```bash
venv\Scripts\activate      # On Windows
```
### 3. Install Dependencies
```bash
pip install -r requirements.txt
```
### 4. Run the App
```bash
python app.py
```
=======
# PDF Merger App

A beautiful, modern Flask web application for merging multiple PDF files into one seamless document. Features a premium UI with drag-and-drop functionality, real-time file validation, and secure local processing.

## Features

- 🎨 **Premium UI Design** - Modern, responsive interface with smooth animations
- 📁 **Drag & Drop Support** - Easy file selection with visual feedback
- 🔒 **Secure Processing** - Files are processed locally, never stored on servers
- ⚡ **Lightning Fast** - Optimized PDF merging with PyPDF2
- 📱 **Mobile Friendly** - Responsive design works on all devices
- 🚫 **No Limits** - Merge unlimited PDF files
- ✅ **Real-time Validation** - Instant feedback on file types and sizes
- 💾 **Auto Download** - Merged PDF automatically downloads

## Installation

1. **Clone or download the project files**

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

## Usage

1. **Upload PDF Files:**
   - Drag and drop PDF files onto the upload area, or
   - Click "browse files" to select files manually
   - Select multiple PDF files (minimum 2 required)

2. **Review Selected Files:**
   - View the list of selected files with sizes
   - Remove individual files if needed
   - Ensure all files are valid PDFs

3. **Merge PDFs:**
   - Click the "Merge PDFs" button
   - Wait for processing to complete
   - The merged PDF will automatically download

## Technical Details

- **Backend:** Flask (Python web framework)
- **PDF Processing:** PyPDF2 library
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with modern design patterns
- **Icons:** Font Awesome 6
- **Fonts:** Inter font family

## File Structure

```
PDF Merger App Using Flask/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Custom CSS styles
│   └── js/
│       └── script.js     # JavaScript functionality
└── uploads/              # Temporary upload directory (auto-created)
```

## Configuration

- **Maximum file size:** 16MB per file
- **Supported formats:** PDF only
- **Upload directory:** `uploads/` (temporary, auto-cleaned)
- **Port:** 5000 (configurable in app.py)

## Security Features

- File type validation (PDF only)
- File size limits
- Secure filename handling
- Temporary file cleanup
- No persistent storage of user files

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

**Common Issues:**

1. **"No files selected" error:**
   - Ensure you've selected at least 2 PDF files
   - Check that files are valid PDF format

2. **File too large error:**
   - Reduce file size (max 16MB per file)
   - Use PDF compression tools if needed

3. **Merge fails:**
   - Ensure all PDF files are not corrupted
   - Try with different PDF files
   - Check console for detailed error messages

## Development

To modify or extend the application:

1. **Backend changes:** Edit `app.py`
2. **Frontend changes:** Edit files in `templates/` and `static/`
3. **Styling changes:** Modify `static/css/style.css`
4. **Functionality changes:** Update `static/js/script.js`

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
>>>>>>> 67a7f96 (PDF Merger initial commit)
