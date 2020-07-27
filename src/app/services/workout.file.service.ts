import { Injectable } from '@angular/core';
var remote = window.require('electron').remote;
var electronFs = remote.require('fs');
var app = remote.app;

@Injectable({
    providedIn: 'root'
})
export class WorkoutFileService {

    loadWorkoutsFromFilesystem() {
        let workoutsFolder = app.getAppPath() + '/workouts';
        var workouts: any[] = [];
    
        var files = electronFs.readdirSync(workoutsFolder);
        files.forEach(fileName => {
            let content = electronFs.readFileSync(workoutsFolder + '/' + fileName, 'utf8');
            workouts.push(content);
        });
        return workouts;
    }

    checkIfFileExists(fileName: string) {
        let path = app.getAppPath() + '/workouts' + '/' + fileName + '.json';
        return electronFs.existsSync(path);
    }
    
    saveFile(fileName: string, content: any) {
        let path = app.getAppPath() + '/workouts' + '/' + fileName + '.json';
        electronFs.writeFileSync(path, JSON.stringify(content, null, 2));
    }

}
