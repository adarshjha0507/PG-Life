import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './Contactform.css';

export const ContactUs = () => {
    const form = useRef();
    const [sentSuccessfully, setSentSuccessfully] = useState(false);
    const [errorOccurred, setErrorOccurred] = useState(false);

    const showMessage = (message, duration = 10000) => {
        const messageElement = document.getElementById("msg");
        messageElement.innerHTML = message;
        messageElement.style.display = "block";
    
        setTimeout(() => {
          messageElement.style.display = "none";
        }, duration);
      };

    const sendEmail = (e) => {
        e.preventDefault();

        // Get client's email address and name from the form
        const clientName = form.current['user_name'].value;

        // Send email to the admin
        emailjs
            .send('service_wt2lgmd', 'template_onukfcn', {
                user_email: 'adarshjha0507@gmail.com', // Admin email
                message: `Query from ${clientName}: ${form.current['message'].value}`,
            }, { publicKey: 'X_-zOOxksHTF8Fju8' })
            .then(() => {
                console.log('Email sent to admin!');
                showMessage("<p className='success-message'>Email sent successfully to the admin!</p>", 10000);
                setSentSuccessfully(true)
            })
            .catch((error) => {
                console.error('Error sending email to admin:', error);
                showMessage("<p className='error-message'>Error occured while sending email to the admin</p>", 10000);
                setErrorOccurred(true);
            });
    };

    return (
        <div id="contacts">
            <div className="container">
                <div className="row">
                    <div className="contact-left">
                        <h1 className="sub-title">Contact Us</h1>
                        <p><b className=''>Admin Mail</b> : <u >adarshjha0507@gmail.com</u></p>
                    </div>
                    <div className="contact-right">
                        <form ref={form} onSubmit={sendEmail}>
                            <input type="text" name="user_name" placeholder="Your name" required />
                            <input type="email" name="user_email" placeholder="Your Email" required />
                            <textarea name="message" rows="6" placeholder="Your Message" required />
                            <button type="submit" className="btn btn2">Submit</button>
                        </form>
                        <div id="msg">
                            {sentSuccessfully && <p className="success-message"></p>}
                            {errorOccurred && <p className="error-message"></p>}
                        </div>
                        <div id="loading" className="loading-overlay">
                            <div className="loading-spinner"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
