import { faUsers, faFileImport, faPlus } from "@fortawesome/free-solid-svg-icons";
import { type StubProps } from "../components/stub/Stub";

const fundraisingManagerStubProps: StubProps = {
  icon: faUsers,
  heading: "No campaigns yet",
  description: "Add your first campaign to start tracking donations and building relationships with your supporters.",
  primaryButtonText: "Import Campaigns",
  secondaryButtonText: "Add Campaign",
  showSecondaryButton: true,
  primaryButtonIcon: faFileImport,
  secondaryButtonIcon: faPlus,
  onPrimaryAction: () => {},
  onSecondaryAction: () => {}
};

export default fundraisingManagerStubProps;
