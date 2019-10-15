declare module 'react-balance-text' {
  export default class BalanceText extends React.Component<
    BalanceTextProps & any,
    any
  > {}

  interface BalanceTextProps {
    style?: any;
    className?: string;
    resize?: boolean;
  }
}
