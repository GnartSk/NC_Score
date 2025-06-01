declare module '*.ics' {
  const content: string;
  export default content;
}

interface ICSEvent {
  title: string;
  start: Date;
  end: Date;
  desc?: string;
  location?: string;
  allDay?: boolean;
}