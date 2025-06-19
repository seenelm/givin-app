import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const dataLibraryStubProps = {
    heading: 'No data files yet',
    description: 'Upload data files to organize and analyze your organization\'s information.',
    primaryButtonText: 'Upload Files',
    primaryButtonIcon: faUpload,
    onPrimaryAction: () => {},
    showSecondaryButton: false,
    secondaryButtonText: '',
    secondaryButtonIcon: undefined,
    onSecondaryAction: undefined,
    icon: faFileAlt 
};      

export default dataLibraryStubProps;