let LifxBulbAPI = require('./lifxbulbapi.js')

let BulbInstructionDispatcher = function (instruction, bulb) {

    return LifxBulbAPI.setBreathe({
        from_color: 'hue:' + instruction.hue + ' brightness:.5 saturation:1',
        color: 'hue:' + instruction.hue + ' brightness:.8 saturation:1',
        period: 1/instruction.frequency,
        cycles: 10*instruction.frequency,
    }, 'c44d8b51d65e94af62de72dac6ea3cf8475bfb61665ed7b6d968311e854af34a').then(function (mes){
        console.log(mes);
    }).catch(console.log.bind(console));

};

module.exports = BulbInstructionDispatcher;
