console.log(Array(parseInt(Math.random() * 3 + 8)).fill().map((_, i)=>{
  let size = Math.random()*50 + 50;
  return {
    x:Math.random()*400,
    y:Math.random()*400,
    width:size,
    heigth:size,
    amount:1,
  }
}));
