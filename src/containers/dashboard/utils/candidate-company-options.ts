import { ApexOptions } from 'apexcharts';
import { CompanyCandidateRatingColor, OffersChartColor } from './colors';
import { months } from './month';
export const Options: ApexOptions = {
    labels: ['Offer compliance', 'Offer violation'],
    chart: {
        height: 250,
    },
    plotOptions: {
        pie: {
            startAngle: 0,
        },
    },
    legend: {
        position: 'bottom',
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 0,
        colors: ['#fff'],
        lineCap: 'round',
    },
    
    colors: CompanyCandidateRatingColor,
    
    responsive: [
        {
            breakpoint: 1370,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom',
                },
            },
        },
    ],
};

export const CandidateOptions: ApexOptions = {
  labels: ['Onboarded', 'Ghosted'],
  chart: {
      height: 250,
  },
  plotOptions: {
      pie: {
          startAngle: 0,
      },
  },
  legend: {
      position: 'bottom',
  },
  dataLabels: {
      enabled: false,
  },
  stroke: {
      width: 0,
      colors: ['#fff'],
      lineCap: 'round',
  },
  
  colors: CompanyCandidateRatingColor,
  responsive: [
      {
          breakpoint: 1370,
          options: {
              chart: {
                  width: 200,
              },
              legend: {
                  position: 'bottom',
              },
          },
      },
  ],
};

export const OptionsOffer: ApexOptions = {
    chart: {
        type: 'radialBar',
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: 'rgba(43, 192, 76, 0.2)',
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false,
              color: '#323130'
            },
            value: {
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      colors: ['#2bc04c'],
      labels: ['Average Results'],
    };

    
export const OptionsOrder: ApexOptions = {
    chart: {
        type: 'radialBar',
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: 'rgba(0, 150, 255, 0.2)',
            strokeWidth: '80%',
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false,
              color: '#323130'
            },
            value: {
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
       
      colors: ['#0096ff'],
      labels: ['Average Results'],
    };