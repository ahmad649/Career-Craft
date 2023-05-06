import { useState, useEffect } from 'react'
import './../css/termsandconditions.css';
import Navbar from './../components/Navbar'
const TermsAndConditions = () => {



    return (
        <div className='tandcMainHolder'>
            <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />

            <div className="termsAndConditionsMain">
                <h1>Welcome to Career Craft!</h1>
                <h3>Eligibility</h3>
                <h5>Our Services are intended solely for individuals who are 18 years of age or older. By using our Services, you represent and warrant that you are 18 years of age or older.</h5>
                <h3>Use of Services</h3>
                <h5>You may use our Services only for lawful purposes and in accordance with this Agreement. You agree not to use our Services:</h5>
                <ul>
                    <li><p>In any way that violates any applicable federal, state, local, or international law or regulation.</p></li>
                    <li><p>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content, asking for personally identifiable information, or otherwise.</p></li>
                    <li><p>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</p></li>
                    <li><p>To impersonate or attempt to impersonate Career Craft, a Career Craft employee, another user, or any other person or entity.</p></li>
                    <li><p>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of our Services, or which, as determined by us, may harm Career Craft or users of our Services, or expose them to liability.</p></li>
                </ul>
                <h3>Account Registration</h3>
                <h5>To access certain features of our Services, you may need to register for an account. When you register for an account, you agree to provide accurate, current, and complete information about yourself as prompted by the registration form, and to update this information as necessary. You also agree to keep your account login credentials confidential and not to share them with anyone else.</h5>
                <h3>Content and Intellectual Property Rights</h3>
                <h5>Our Services and all content and materials included on or accessible through our Services, including text, graphics, logos, images, audio, video, software, and other materials (collectively, "Content"), are owned by Career Craft or its licensors, and are protected by copyright, trademark, and other laws.</h5>
                <h5>You may access and use our Services and Content only for your personal, non-commercial use. You may not copy, reproduce, modify, distribute, transmit, display, publish, or create derivative works from any Content without our prior written consent.</h5>
                <h3>Disclaimer of Warranties</h3>
                <h5>We provide our Services "as is" and without any warranty or condition, express, implied, or statutory. We specifically disclaim any implied warranties of title, merchantability, fitness for a particular purpose, and non-infringement.</h5>
                <h5>We do not guarantee that our Services will be uninterrupted or error-free, and we do not make any warranty as to the accuracy, completeness, or reliability of any Content or information provided through our Services.</h5>
                <h3>Limitation of Liability</h3>
                <h5>Career Craft will not be liable for any damages of any kind arising out of or in connection with your use of our Services, including but not limited to direct, indirect, incidental, punitive, and consequential damages, unless otherwise specified in writing.</h5>
                <h3>Indemnification</h3>
                <h5>You agree to indemnify, defend, and hold harmless Career Craft, its affiliates, and their respective officers, directors, employees, agents, licensors, and suppliers from and against all claims, liabilities, expenses, damages, and losses, including reasonable attorneys' fees, arising out of or in connection with your use of our Services or any violation of this</h5>
                <h3>Use of Content</h3>
                <h5>Career Craft reserves the right to use any content (including but not limited to job postings, resumes, and user profiles) submitted by users to improve our services. However, Career Craft assures users that their data will not be sold to third parties. We value the privacy and security of our users and will only use their data to provide and enhance our services. By using Career Craft, you agree to allow us to use your content for the sole purpose of improving our services.</h5>
            </div>
        </div>
    )
}

export default TermsAndConditions
