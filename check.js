const schema = require("./model/test");
require("./connection/conn")
const obj ={
id:"oyejassi",
date:Date.now()

}
const obje = JSON.stringify(obj);

const detail= {
  email:"jass@0123",
  data:[obje,"finger","thumb"]
}
async function send()
{
  //const usr = new schema(detail);
  const data1 = await schema.findOne({email:"jass@01"});
  //data1.data.push(obje);
  //const adnew = await schema.updateOne({email:"jass@0123"},{data:data1.data})
   //  const date = JSON.parse(data1.data.pop())
   if(!data1)
   {
    console.log("yes")
   }
   else{
    console.log("no"); 
   }
      
}
 send();
// array=[1,2,3,4]
// function removeItemOnce(arr, value) {
//   var index = arr.indexOf(value);
//   if (index > -1) {
//     arr.splice(index, 1);
//   }
//   return arr;
// }
// removeItemOnce(array,2)
// console.log(array[1]);