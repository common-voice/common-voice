// typescript support for css module files
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
