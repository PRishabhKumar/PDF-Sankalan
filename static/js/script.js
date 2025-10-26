document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectedFiles = document.getElementById('selectedFiles');
    const fileList = document.getElementById('fileList');
    const mergeBtn = document.getElementById('mergeBtn');
    const uploadForm = document.getElementById('uploadForm');
    const browseLink = document.querySelector('.browse-link');
    const themeToggle = document.getElementById('themeToggle');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    let files = [];
    let isProcessing = false;

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Mobile navigation toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section, header, .features-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Premium animation utilities
    const PremiumAnimations = {
        // Smooth fade in with stagger
        fadeInStagger: (elements, delay = 100) => {
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    requestAnimationFrame(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                }, index * delay);
            });
        },

        // Subtle pulse for interactive elements
        pulse: (element, duration = 600) => {
            element.style.animation = `pulse ${duration}ms ease-in-out`;
            setTimeout(() => {
                element.style.animation = '';
            }, duration);
        },

        // Success celebration
        celebrate: (element) => {
            element.style.animation = 'celebrate 0.6s ease-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 600);
        },

        // Error shake
        shake: (element) => {
            element.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    };

    // Format file size with precision
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Update file list with smooth animations
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
            li.style.opacity = '0';
            li.style.transform = 'translateX(-20px)';
            
            li.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file-pdf"></i>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="remove-file" onclick="removeFile(${index})" title="Remove file">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            fileList.appendChild(li);
            
            // Animate in
            setTimeout(() => {
                li.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                li.style.opacity = '1';
                li.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }

    // Enhanced file handling
    function addFiles(newFiles) {
        const validFiles = [];
        const invalidFiles = [];

        Array.from(newFiles).forEach(file => {
            if (file.type === 'application/pdf') {
                if (validateFile(file)) {
                    validFiles.push(file);
                }
            } else {
                invalidFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            showNotification(`Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`, 'error');
            PremiumAnimations.shake(dropZone);
        }

        if (validFiles.length > 0) {
            files.push(...validFiles);
            updateFileList();
            PremiumAnimations.pulse(selectedFiles);
            showNotification(`Added ${validFiles.length} file(s) successfully`, 'success');
        }
    }

    // Enhanced file validation
    function validateFile(file) {
        const maxSize = 16 * 1024 * 1024; // 16MB
        if (file.size > maxSize) {
            showNotification(`File "${file.name}" exceeds 16MB limit`, 'error');
            return false;
        }
        return true;
    }

    // Remove file with animation
    window.removeFile = function(index) {
        const fileItem = fileList.children[index];
        if (fileItem) {
            fileItem.style.transition = 'all 0.3s ease-out';
            fileItem.style.opacity = '0';
            fileItem.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                files.splice(index, 1);
                updateFileList();
            }, 300);
        }
    };

    // Premium notification system
    function showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `flash-message flash-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add entrance animation
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px) scale(0.95)';
        
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

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0) scale(1)';
        });

        // Auto remove with animation
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px) scale(0.95)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Enhanced drag and drop
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('dragover');
        PremiumAnimations.pulse(dropZone, 300);
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        if (!dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('dragover');
        }
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            addFiles(droppedFiles);
            PremiumAnimations.celebrate(dropZone);
        }
    });

    // Enhanced file input
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            addFiles(e.target.files);
            PremiumAnimations.celebrate(fileInput);
        }
    });

    // Enhanced browse link
    browseLink.addEventListener('click', function(e) {
        e.preventDefault();
        PremiumAnimations.pulse(browseLink, 200);
        fileInput.click();
    });

    // Premium form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (isProcessing) return;
        
        if (files.length < 2) {
            showNotification('Please select at least 2 PDF files to merge', 'error');
            PremiumAnimations.shake(mergeBtn);
            return;
        }

        isProcessing = true;
        
        // Show loading state
        mergeBtn.disabled = true;
        mergeBtn.querySelector('span').style.display = 'none';
        mergeBtn.querySelector('.btn-loading').style.display = 'block';
        
        // Add loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        loadingOverlay.innerHTML = `
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            "></div>
            <div style="color: white; font-size: 1.1rem; font-weight: 500;">Merging PDFs...</div>
        `;
        
        document.body.appendChild(loadingOverlay);
        
        // Fade in overlay
        requestAnimationFrame(() => {
            loadingOverlay.style.opacity = '1';
        });

        // Create FormData
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        // Submit with fetch
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
            // Create download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `merged_pdf_${new Date().getTime()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showNotification('PDFs merged successfully! Download started.', 'success', 3000);
            PremiumAnimations.celebrate(mergeBtn);
            
            // Reset form
            files = [];
            updateFileList();
            fileInput.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error merging PDFs. Please try again.', 'error');
            PremiumAnimations.shake(mergeBtn);
        })
        .finally(() => {
            isProcessing = false;
            
            // Reset button
            mergeBtn.disabled = false;
            mergeBtn.querySelector('span').style.display = 'inline';
            mergeBtn.querySelector('.btn-loading').style.display = 'none';
            
            // Remove overlay
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 300);
        });
    });

    // Prevent default drag behaviors
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
    });

    // Enhanced feature card interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + O to open files
        if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
            e.preventDefault();
            PremiumAnimations.pulse(fileInput, 200);
            fileInput.click();
        }
        
        // Escape to clear
        if (e.key === 'Escape') {
            files = [];
            updateFileList();
            fileInput.value = '';
            showNotification('Selection cleared', 'info', 2000);
        }
        
        // Enter to submit
        if (e.key === 'Enter' && files.length >= 2 && !isProcessing) {
            uploadForm.dispatchEvent(new Event('submit'));
        }
    });

    // Initialize with entrance animation
    updateFileList();
    
    // Welcome animation
    setTimeout(() => {
        const welcomeElements = document.querySelectorAll('.header-content, .upload-card');
        PremiumAnimations.fadeInStagger(welcomeElements, 150);
    }, 100);
});

// Additional CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes celebrate {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.05) rotate(1deg); }
        50% { transform: scale(1.02) rotate(-1deg); }
        75% { transform: scale(1.05) rotate(0.5deg); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
        20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
`;
document.head.appendChild(style);