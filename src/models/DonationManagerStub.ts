import { faUsers, faFileImport, faPlus } from "@fortawesome/free-solid-svg-icons";
import { type StubProps } from "../components/stub/Stub";

// Create a constant with the default props for the donor manager stub
const donorManagerStubProps: StubProps = {
  icon: faUsers,
  heading: "No donors yet",
  description: "Add your first donor to start tracking donations and building relationships with your supporters.",
  primaryButtonText: "Import Donors",
  secondaryButtonText: "Add Donor",
  showSecondaryButton: true,
  primaryButtonIcon: faFileImport,
  secondaryButtonIcon: faPlus,
  onPrimaryAction: () => {},
  onSecondaryAction: () => {}
};

export default donorManagerStubProps;
