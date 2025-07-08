/**
 * Command Pattern - Calendar Alarm Example
 *
 * This example demonstrates using the Command pattern to schedule, execute, and undo calendar alarms.
 */

// Command interface
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver: AlarmService
class AlarmService {
  private alarms: Set<string> = new Set();

  setAlarm(time: string) {
    this.alarms.add(time);
    console.log(`⏰ Alarm set for ${time}`);
  }

  cancelAlarm(time: string) {
    if (this.alarms.has(time)) {
      this.alarms.delete(time);
      console.log(`❌ Alarm for ${time} cancelled`);
    } else {
      console.log(`No alarm set for ${time}`);
    }
  }

  listAlarms() {
    if (this.alarms.size === 0) {
      console.log('No alarms set.');
    } else {
      console.log('Current alarms:', Array.from(this.alarms).join(', '));
    }
  }
}

// Concrete Command: SetAlarmCommand
class SetAlarmCommand implements Command {
  private backup: boolean = false;
  constructor(private alarmService: AlarmService, private time: string) {}

  execute(): void {
    this.backup = false;
    this.alarmService.setAlarm(this.time);
  }

  undo(): void {
    this.alarmService.cancelAlarm(this.time);
    this.backup = true;
  }
}

// Concrete Command: CancelAlarmCommand
class CancelAlarmCommand implements Command {
  private backup: boolean = false;
  constructor(private alarmService: AlarmService, private time: string) {}

  execute(): void {
    this.backup = false;
    this.alarmService.cancelAlarm(this.time);
  }

  undo(): void {
    this.alarmService.setAlarm(this.time);
    this.backup = true;
  }
}

// Invoker: AlarmScheduler
class AlarmScheduler {
  private history: Command[] = [];

  schedule(command: Command) {
    command.execute();
    this.history.push(command);
  }

  undoLast() {
    const command = this.history.pop();
    if (command) {
      command.undo();
    } else {
      console.log('Nothing to undo.');
    }
  }
}

// Demo usage
export function demonstrateCalendarAlarmCommand() {
  const alarmService = new AlarmService();
  const scheduler = new AlarmScheduler();

  // Set alarms
  const setAlarm7 = new SetAlarmCommand(alarmService, '07:00');
  const setAlarm8 = new SetAlarmCommand(alarmService, '08:00');
  scheduler.schedule(setAlarm7);
  scheduler.schedule(setAlarm8);
  alarmService.listAlarms();

  // Cancel an alarm
  const cancelAlarm7 = new CancelAlarmCommand(alarmService, '07:00');
  scheduler.schedule(cancelAlarm7);
  alarmService.listAlarms();

  // Undo last action (undo cancel)
  scheduler.undoLast();
  alarmService.listAlarms();

  // Undo previous action (undo set 8:00)
  scheduler.undoLast();
  alarmService.listAlarms();
}

demonstrateCalendarAlarmCommand();
