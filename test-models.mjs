const apiKey = 'AIzaSyDb7IE6IbSQBG686kgWZnxxwTnjdm-Jt4Q';
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
.then(res => res.json())
.then(d => { if(d.models) console.log(d.models.map(m => m.name).join('\n')); else console.error(d); })
.catch(e => console.error(e));
