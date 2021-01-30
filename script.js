var app = new Vue({
    el: '#app',
    data: {
        stats: {},
        error: {
            key: ""
        },
        info: {
            uuid: null,
            key: null,
            displayname: null
        },
        loop: null
    },
    methods: {
      async verifyKey() {
        try {
            const res = await axios.get(`https://api.hypixel.net/key?key=${this.info.key}`)
            console.log(res.data)
            this.info.uuid = res.data.record.owner
            this.error.key = ""
            const res2 = await axios.get(`https://api.hypixel.net/player?uuid=${this.info.uuid}&key=${this.info.key}`)
            console.log(res2.data.player.displayname)
            this.info.displayname = res2.data.player.displayname
            this.loop = setInterval(() => {this.getData()}, 1000)
        }
        catch (error) {
            this.error.key = error.response.data.cause
        }     
      },
      async getData() {
        const res = await await axios.get(`https://api.hypixel.net/player?uuid=${this.info.uuid}&key=${this.info.key}`)
        console.log(res.data.player.stats.SkyWars)
        if (this.stats.games - res.data.player.stats.SkyWars.games == -1) {
            const kills = res.data.player.stats.SkyWars.kills - this.stats.kills
            this.updateStats(res, kills)
        }
        this.stats = res.data.player.stats.SkyWars
      },
      updateStats(res, kills) {
        addData(this.stats.games, kills)
      }
    }
})

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Kills per game',
            data: [],
            borderWidth: 5
        }]
    },
    options: {
        responsive: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

function addData(label, data) {
    myChart.data.labels.push(label);
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    myChart.update();
}