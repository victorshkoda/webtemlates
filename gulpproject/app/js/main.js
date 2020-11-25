console.log('main.js')

async function start(){
    return await Promise.resolve("Working async")
}
start().then(console.log)

const foo = () => {
    console.log('From fun function')
}
foo()