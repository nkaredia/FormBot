export const CONST: { NEW_DATA: number, SAVE_DATA: number } =
        { NEW_DATA: 1, SAVE_DATA: 2 };
        
/**
 * 
 * Message Passing Object - Always use this definition for message passing
 */
export interface message{
  success:boolean,
  message: string,
  type:any,
  data: data  
}

interface data{
  name: string,
  message:any
}