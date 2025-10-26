document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectedFiles = document.getElementById('selectedFiles');
    const fileList = document.getElementById('fileList');
    const mergeBtn = document.getElementById('mergeBtn');
    const uploadForm = document.getElementById('uploadForm');
    const browseLink = document.querySelector('.browse-link');

    let files = [];

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Update file list display
    function updateFileList() {
        if (files.length === 0) {
            selectedFiles.style.display = 'none';
            mergeBtn.disabled = true;
            return;
        }

        selectedFiles.style.display = 'block';
        mergeBtn.disabled = false;

        fileList.innerHTML = '';
        files.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'file-item';
            li.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-pdf"></i>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="remove-file" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(li);
        });
    }

    // Add files to the list
    function addFiles(newFiles) {
        Array.from(newFiles).forEach(file => {
            if (file.type === 'application/pdf') {
                files.push(file);
            } else {
                showNotification(`File "${file.name}" is not a PDF file`, 'error');
            }
        });
        updateFileList();
    }

    // Remove file from list
    window.removeFile = function(index) {
        files.splice(index, 1);
        updateFileList();
    };

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `flash-message flash-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            ${message}
        `;
        
        const flashMessages = document.querySelector('.flash-messages');
        if (flashMessages) {
            flashMessages.appendChild(notification);
        } else {
            const uploadCard = document.querySelector('.upload-card');
            const flashContainer = document.createElement('div');
            flashContainer.className = 'flash-messages';
            flashContainer.appendChild(notification);
            uploadCard.insertBefore(flashContainer, uploadForm);
        }

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Drag and drop functionality
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        const droppedFiles = e.dataTransfer.files;
        addFiles(droppedFiles);
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        addFiles(e.target.files);
    });

    // Browse link click
    browseLink.addEventListener('click', function(e) {
        e.preventDefault();
        fileInput.click();
    });

    // Form submission
    uploadForm.addEventListener('submit', function(e) {
        if (files.length < 2) {
            e.preventDefault();
            showNotification('Please select at least 2 PDF files to merge', 'error');
            return;
        }

        // Show loading state
        mergeBtn.disabled = true;
        mergeBtn.querySelector('span').style.display = 'none';
        mergeBtn.querySelector('.btn-loading').style.display = 'block';

        // Create FormData and append files
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        // Submit form via fetch
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error('Upload failed');
            }
        })
        .then(blob => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `merged_pdf_${new Date().getTime()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showNotification('PDFs merged successfully! Download started.', 'success');
            
            // Reset form
            files = [];
            updateFileList();
            fileInput.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error merging PDFs. Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            mergeBtn.disabled = false;
            mergeBtn.querySelector('span').style.display = 'inline';
            mergeBtn.querySelector('.btn-loading').style.display = 'none';
        });

        e.preventDefault();
    });

    // Prevent default drag behaviors on the entire page
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
    });

    // Add interactive hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Initialize
    updateFileList();
});
