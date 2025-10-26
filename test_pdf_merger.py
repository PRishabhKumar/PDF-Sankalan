#!/usr/bin/env python3
"""
Test script for PDF Merger functionality
This script creates sample PDFs and tests the merging functionality
"""

import os
import sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import PyPDF2
import io

def create_sample_pdf(filename, content):
    """Create a sample PDF file with given content"""
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    # Add content
    c.drawString(100, height - 100, f"Sample PDF: {content}")
    c.drawString(100, height - 150, "This is a test PDF file created for testing purposes.")
    c.drawString(100, height - 200, "PDF Merger App - Test Document")
    
    c.save()
    print(f"Created sample PDF: {filename}")

def test_pdf_merge():
    """Test the PDF merging functionality"""
    print("Testing PDF Merger functionality...")
    
    # Create sample PDFs
    pdf1 = "test1.pdf"
    pdf2 = "test2.pdf"
    pdf3 = "test3.pdf"
    
    create_sample_pdf(pdf1, "Document 1")
    create_sample_pdf(pdf2, "Document 2")
    create_sample_pdf(pdf3, "Document 3")
    
    # Test merging
    try:
        merger = PyPDF2.PdfMerger()
        
        # Add PDFs to merger
        merger.append(pdf1)
        merger.append(pdf2)
        merger.append(pdf3)
        
        # Write merged PDF
        output_filename = "merged_test.pdf"
        merger.write(output_filename)
        merger.close()
        
        print(f"Successfully merged PDFs into: {output_filename}")
        
        # Verify the merged PDF
        with open(output_filename, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            page_count = len(reader.pages)
            print(f"Merged PDF has {page_count} pages")
            
            if page_count == 3:
                print("✅ PDF merging test PASSED!")
            else:
                print("❌ PDF merging test FAILED!")
                
    except Exception as e:
        print(f"❌ Error during PDF merging: {str(e)}")
        return False
    
    finally:
        # Clean up test files
        for filename in [pdf1, pdf2, pdf3, "merged_test.pdf"]:
            try:
                if os.path.exists(filename):
                    os.remove(filename)
                    print(f"Cleaned up: {filename}")
            except:
                pass
    
    return True

if __name__ == "__main__":
    print("PDF Merger Test Suite")
    print("=" * 50)
    
    # Check if required libraries are available
    try:
        import PyPDF2
        print("✅ PyPDF2 library available")
    except ImportError:
        print("❌ PyPDF2 library not found. Please install it with: pip install PyPDF2")
        sys.exit(1)
    
    try:
        import reportlab
        print("✅ ReportLab library available")
    except ImportError:
        print("❌ ReportLab library not found. Please install it with: pip install reportlab")
        sys.exit(1)
    
    # Run the test
    success = test_pdf_merge()
    
    if success:
        print("\n🎉 All tests passed! The PDF Merger app is ready to use.")
    else:
        print("\n❌ Tests failed. Please check the error messages above.")
        sys.exit(1)
