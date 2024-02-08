export class InMemoryDataService {
  createDb() {
    let tasks = [
      {
        id: 1,
        text: "Projet Title",
        start_date: "2024-02-15",
        end_date: "2024-02-29",
        parent: 0,
        open: true,
      },
      {
        id: 2,
        text: "Task #1",
        start_date: "2024-02-16",
        end_date: "2024-02-18",
        parent: 1,
      },
      {
        id: 3,
        text: "Task #2",
        start_date: "2024-02-18",
        end_date: "2024-02-20",
        parent: 1,
      },
      {
        id: 4,
        text: "Task #3",
        start_date: "2024-02-25",
        end_date: "2024-02-26",
        parent: 1,
      },
      {
        id: 5,
        text: "Task #4",
        start_date: "2024-02-21",
        end_date: "2024-02-23",
        parent: 1,
      },
    ];
    let links = [
      {},
      { id: 1, source: 1, target: 2, type: "1" },
      { id: 2, source: 1, target: 3, type: "1" },
      { id: 3, source: 1, target: 4, type: "1" },
      { id: 4, source: 1, target: 5, type: "1" },
    ];
    return { tasks, links };
  }

  formatGantt(projetData: any) {
    var dataTask = [
      {
        id: 1,
        text: "Projet Title",
        start_date: projetData.date_deb,
        end_date: projetData.date_fin,
        parent: 0,
      },
    ];

    var links = [{}];

    projetData.tasks.forEach((el: any) => {
      dataTask.push({
        id: el.id,
        text: el.title,
        start_date: el.date_deb,
        end_date: el.deadline,
        parent: 1,
      });
      links.push({ id: el.id, source: 1, target: el.id, type: "1" });
    });

    return { dataTask, links };
  }
}
