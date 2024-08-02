export interface ConfirmationModel {
  text: string;
  isDanger: boolean;
  action: () => void;
}
