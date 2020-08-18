import * as React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';
import BuildIcon from '@material-ui/icons/Build';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import HomeIcon from '@material-ui/icons/Home';
import MergeTypeIcon from '@material-ui/icons/MergeType';

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    display: 'flex',
    flexDirection: 'column'
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
    display: 'none'
  }
};

const iconStyles = {width: '40px', height: '40px', color: 'white', marginRight: '16px', padding: '6px'}

export const Navigation = ({toggle}) => (
  <motion.ul onClick={toggle} variants={variants}>
    <MenuItem location={"/"} icon={<HomeIcon style={iconStyles}/>} text={'Home'} key={'home'} />
    <MenuItem location={"/fileMerge"} icon={<MergeTypeIcon style={iconStyles}/>} text={'File Merge'} key={'fileMerge'} />
    <MenuItem location={"/apiconfiguration"} icon={<BuildIcon style={iconStyles}/>} text={'Api Management'} key={'api-settings'} />
    <MenuItem location={"/profile"} icon={<PersonIcon style={iconStyles}/>} text={'Profile'} key={'profile'} />
    <MenuItem location={"/help"} icon={<ContactSupportIcon style={iconStyles}/>} text={'Help'} key={'help'} />
    
  </motion.ul>
);
