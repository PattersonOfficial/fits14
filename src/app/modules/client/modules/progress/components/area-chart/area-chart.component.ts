import {Component, Input, OnInit} from '@angular/core';
import ApexCharts from 'apexcharts/dist/apexcharts.common.js';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent implements OnInit {
  public chartOptions: any;
  public chart: ApexCharts;
  @Input() id: string;
  @Input() series: any[];
  @Input() colors: string;
  @Input() yaxis: string;

  constructor() {}

  ngOnInit() {
    this.chartOptions = {
      series: this.series,
      chart: {
        height: 300,
        type: 'area',
        zoom: {
          enabled: false
        },
        toolbar: {
          tools: {
            download: false
          }
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.9,
          stops: [0, 70, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: this.colors,
      markers: {
        size: 3,
        colors: undefined,
        strokeColors: '#fff',
        strokeWidth: 2,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        shape: 'circle',
        radius: 2,
        offsetX: 0,
        offsetY: 0,
        onClick: undefined,
        onDblClick: undefined,
        showNullDataPoints: true,
        hover: {
          size: undefined,
          sizeOffset: 3
        }
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'category'
      },
      yaxis: {
        title: {
          text: this.yaxis,
          style: {
            color: '#a2aab7',
            fontSize: '10px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600
          },
        },
      },
      tooltip: {
        fillSeriesColor: true,
        theme: 'light',
        style: {
          fontSize: '10px',
          fontFamily: 'Montserrat, sans-serif',
        }
      },

    };

    this.chart = new ApexCharts(document.querySelector('#chart-bmi'), this.chartOptions);

    this.chart.render();
  }

}
