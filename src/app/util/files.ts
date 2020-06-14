var remote = window.require('electron').remote;
var electronFs = remote.require('fs');
var app = remote.app;

export function loadWorkoutsFromFilesystem() {
    let workoutsFolder = app.getAppPath() + '\\workouts';
    var workouts: any[] = [];

    var files = electronFs.readdirSync(workoutsFolder);
    files.forEach(fileName => {
        let content = electronFs.readFileSync(workoutsFolder + '\\' + fileName, 'utf8');
        workouts.push(content);
    });
    return workouts;
}

export function checkIfFileExists(fileName: string) {
    let path = app.getAppPath() + '\\workouts' + '\\' + fileName + '.json';
    return electronFs.existsSync(path);
}

export function saveFile(fileName: string, content: any) {
    let path = app.getAppPath() + '\\workouts' + '\\' + fileName + '.json';
    electronFs.writeFileSync(path, JSON.stringify(content));
}
