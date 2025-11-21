import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import AOS from 'aos';
import 'aos/dist/aos.css';
import emailjs from '@emailjs/browser';


@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  isSending = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    AOS.init({ duration: 1000 });

    emailjs.init("Xuhr6QZBJj9pHiMMe");
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.contactForm.invalid) {
      this.errorMessage = 'Please fix the errors in the form before submitting.';
      return;
    }

    this.isSending = true;
    const formData = this.contactForm.value;

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message
    };

    emailjs.send(
      'service_48nq8xp',
      'template_8vhy5p8',
      templateParams,
    )
    .then(() => {
        this.successMessage = '✅ Message sent successfully!';
        alert(this.successMessage);
        this.contactForm.reset();
        this.submitted = false;
      })
    .catch((error) => {
        console.error('EmailJS Error:', error);
        const detail = error?.text || error?.message;
        this.errorMessage = '❌ Failed to send message. Please try again.';
        if (detail) {
          this.errorMessage += ` (${detail})`;
        }
        alert(this.errorMessage);
    })
    .finally(() => {
        this.isSending = false;
    });
  }
}
