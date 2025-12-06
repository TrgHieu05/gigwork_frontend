import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame3}>
      <div className={styles.frame21}>
        <div className={styles.ellipse1} />
        <div className={styles.ellipse2} />
      </div>
      <div className={styles.frame6}>
        <div className={styles.frame4}>
          <p className={styles.signUpTo}>Sign up to</p>
          <p className={styles.gigwork}>Gigwork</p>
        </div>
        <div className={styles.frame5}>
          <p className={styles.haveAnAccount}>Have an account ?</p>
          <p className={styles.link}>Sign in here</p>
        </div>
      </div>
      <div className={styles.frame14}>
        <p className={styles.whatIsYourRole}>What is your role ?</p>
        <div className={styles.frame8}>
          <div className={styles.roleSelector}>
            <div className={styles.frame12}>
              <img
                src="../image/mium6bf3-6t8izzs.svg"
                className={styles.briefcase}
              />
              <p className={styles.recruiter}>Recruiter</p>
            </div>
            <p className={styles.uploadYourJobAndFind}>
              Upload your job and find suitable workers !
            </p>
          </div>
          <div className={styles.roleSelector2}>
            <div className={styles.frame122}>
              <img
                src="../image/mium6bf3-5r9r660.svg"
                className={styles.briefcase}
              />
              <p className={styles.recruiter2}>Job Seeker</p>
            </div>
            <p className={styles.uploadYourJobAndFind2}>
              Find a job that's suitable for you and apply !
            </p>
          </div>
        </div>
      </div>
      <div className={styles.frame10}>
        <div className={styles.inputText}>
          <p className={styles.label}>Full name</p>
          <div className={styles.frame1}>
            <p className={styles.placeholder}>Full name</p>
          </div>
        </div>
        <div className={styles.inputText}>
          <p className={styles.label}>Email address</p>
          <div className={styles.frame1}>
            <p className={styles.placeholder}>Placeholder</p>
          </div>
        </div>
        <div className={styles.inputPassword}>
          <p className={styles.label}>Password</p>
          <div className={styles.frame13}>
            <p className={styles.placeholder2}>Enter your pasword</p>
            <img src="../image/mium6bf3-dj8afr1.svg" className={styles.briefcase} />
          </div>
        </div>
        <div className={styles.inputPassword}>
          <p className={styles.label}>Confirm password</p>
          <div className={styles.frame13}>
            <p className={styles.placeholder2}>Repeat your password</p>
            <img src="../image/mium6bf3-dj8afr1.svg" className={styles.briefcase} />
          </div>
        </div>
      </div>
      <div className={styles.frame15}>
        <div className={styles.checkbox}>
          <img
            src="https://via.placeholder.com/24x24"
            className={styles.briefcase}
          />
        </div>
        <div className={styles.frame20}>
          <p className={styles.haveAnAccount}>By signing up, you agree to our</p>
          <p className={styles.link}>Term of Service</p>
          <p className={styles.haveAnAccount}>and</p>
          <p className={styles.link}>Privacy Policy</p>
        </div>
      </div>
      <div className={styles.button2}>
        <p className={styles.button}>Create Account</p>
      </div>
    </div>
  );
}

export default Component;
