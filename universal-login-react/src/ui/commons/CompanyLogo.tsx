import React from 'react';
// import UImage from '../../assets/U.svg';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/companyLogo.sass';

export const CompanyLogo = () => (
  <div className={useClassFor('company-logo')}>
    <div className={classForComponent('logo-icon')}></div>
    <p className={classForComponent('logo-label')}>BETA</p>
  </div>
);
