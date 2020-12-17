document.getElementById("tickerSubmit").addEventListener("click", function(event) {
  event.preventDefault();
  const value = document.getElementById("tickerInput").value;
  if (value === "")
    return;

  const url = "https://cloud.iexapis.com/stable/stock/" + value + "/quote?token=pk_3be5bc48ec75462aa38f4ceeec9b31a7&chartIEXOnly=true";
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {

      let stats = "";
      stats += '<h2>' + json.companyName + " Financial Profile</h2>";
      document.getElementById("profileStats").innerHTML = stats;

      let table = document.createElement("table");

      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      let high = '$' + json.high;
      let mCap = '$' + numberWithCommas((json.marketCap / 1000000000).toFixed(0)) + 'B'
      let avgVol = numberWithCommas((json.avgTotalVolume / 1000000).toFixed(0)) + 'M'

      let fields = [high, mCap, avgVol]
      let row = document.createElement("tr");
      fields.forEach(function(field) {
        let cell = document.createElement("td");

        cell.appendChild(document.createTextNode(field));
        row.appendChild(cell);
      });
      table.appendChild(row);

      labels = ['Last Closing Price', 'Market Capitalization', 'Average Volume']
      row = document.createElement("tr");
      labels.forEach(function(label) {
        let cell = document.createElement("th");
        if (label === 'Market Capitalization') {
          cell.width = '1600px'
        } else {
          cell.width = '800px'
        }
        cell.appendChild(document.createTextNode(label));
        row.appendChild(cell);
      });
      table.appendChild(row);

      document.querySelector("#profileStats").appendChild(table);
    });
  const url2 = "https://cloud.iexapis.com/stable/stock/" + value + "/intraday-prices?token=pk_3be5bc48ec75462aa38f4ceeec9b31a7&chartIEXOnly=true";
  fetch(url2)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      var result = [];
      var times = [];

      for (var i = 0; i < json.length; i++) {
        if (i % 15 == 0 && ((json[i].high + json[i].low) / 2).toFixed(0) > 0) {
          result.push(((json[i].high + json[i].low) / 2).toFixed(2));
          times.push(json[i].label)
        }
      }

      var options = {
        series: [{
          name: value.toUpperCase() + " price",
          data: result
        }],
        chart: {
          type: 'area',
          fontFamily: 'Ubuntu, sans-serif',
          stacked: false,
          height: 500,
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true

          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return '$' + val.toFixed(2)
          }
        },
        grid: {
          row: {
            colors: ['#004a86', '000000'],
            opacity: .1
          },
        },
        markers: {
          size: 5,
        },
        title: {
          text: value.toUpperCase() + ' Stock Price Movements Today',
          style: {
            fontFamily: 'Abel, sans-serif',
            fontSize: '24px',
          },
          align: 'center'
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return '$' + (val).toFixed(2);
            },
          },
          title: {
            text: 'Price',
            style: {
              fontSize: '16px',
            },
          },
        },
        xaxis: {
          categories: times
        },
        tooltip: {
          shared: false,
          fillSeriesColor: false,
          y: {
            formatter: function(val) {
              return '$' + val.toFixed(2)
            }
          },
        }
      };
      var chart = new ApexCharts(document.querySelector("#chart"), options);
      document.getElementById("chart").style.padding = "30px";
      chart.render();
    });
});