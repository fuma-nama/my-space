import { reactive } from "vue";

export interface Note {
  title: string;
  description: string;
  date: number;
}

export const store = reactive({
  notes: [] as Note[],
  loaded: false,
  init() {
    this.loaded = true;
    this.notes = readNotes();
  },
  setNotes(notes: Note[]) {
    localStorage.setItem("notes", JSON.stringify(notes));
    this.notes = notes;
  },
});

export function readNotes(): Note[] {
  const data = localStorage.getItem("notes");
  if (data) return JSON.parse(data) as Note[];

  return [];
}
