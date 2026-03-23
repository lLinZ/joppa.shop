import { forwardRef } from 'react';
export default forwardRef(function TextInput(props: any, ref: any) { return <input {...props} ref={ref} />; });