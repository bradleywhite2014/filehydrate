import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import AppFooter from './modules/views/AppFooter';
import ProductHero from './modules/views/ProductHero';
import ProductHowItWorks from './modules/views/ProductHowItWorks';
import AppAppBar from './modules/views/AppAppBar';
import Merge from './Merge'
import FileSelect from './FileSelect'
import ToastMessage from '../components/ToastMessage'
import GlobalModal from '../components/GlobalModal'
import NavHamburger from '../components/NavHamburger'


function Index(props) {
  switch(props.mainSection){
    case 'merge': 
      return ( <React.Fragment>
        <div style={{minHeight: '100%'}}>
          <AppAppBar />
          <Merge />
          <ToastMessage />
          <GlobalModal/>
        </div>
          <AppFooter />
        </React.Fragment>
      );
    case 'fileSelect': 
      return ( <React.Fragment>
        <div style={{minHeight: '100%'}}>
          <AppAppBar />
          <FileSelect />
          <ToastMessage />
          <GlobalModal/>
          </div>
          <AppFooter />
        </React.Fragment>
      );
    default: 
      return (<React.Fragment>
        <div style={{minHeight: '100%'}}>
        <AppAppBar />
        <ProductHero />
        <ProductHowItWorks />
        <ToastMessage />
        <GlobalModal/>
        <AppFooter />
        </div>
      </React.Fragment>
      );
  };
}

export default withRoot(Index);
