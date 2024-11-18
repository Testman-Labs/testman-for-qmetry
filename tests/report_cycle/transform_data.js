var args = process.argv.slice(2);
var dataArg = args.find(arg => arg.startsWith('--data='));
if (dataArg) {
    var data = dataArg.split('=')[1];
    const decodedData = decodeURIComponent(data);
    const dataObj = JSON.parse(decodedData);

    console.log(JSON.stringify(dataObj));
} else {
    throw new Error("No se encontró el argumento 'data='");
}