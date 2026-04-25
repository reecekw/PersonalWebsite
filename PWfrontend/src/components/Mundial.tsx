import React from 'react';
import { Link } from 'react-router-dom';
import './Resume.css'; 

// 1. Updated interface to include the new 'group' property
interface Team {
  id: number;
  name: string;
  group: string;
  confederation: string;
  population: string;
  fifaRanking: number;
}

// 2. The 48-team dataset, updated with your exact Group draws and emojis
const teamsData: Team[] = [
  // GROUP A
  { id: 1, name: "Mexico 🇲🇽", group: "A", confederation: "CONCACAF", population: "127.5M", fifaRanking: 15 },
  { id: 2, name: "South Korea 🇰🇷", group: "A", confederation: "AFC", population: "51.6M", fifaRanking: 25 },
  { id: 3, name: "Czechia 🇨🇿", group: "A", confederation: "UEFA", population: "10.5M", fifaRanking: 41 },
  { id: 4, name: "South Africa 🇿🇦", group: "A", confederation: "CAF", population: "60.0M", fifaRanking: 59 },

  // GROUP B
  { id: 5, name: "Switzerland 🇨🇭", group: "B", confederation: "UEFA", population: "8.7M", fifaRanking: 19 },
  { id: 6, name: "Canada 🇨🇦", group: "B", confederation: "CONCACAF", population: "38.9M", fifaRanking: 30 },
  { id: 7, name: "Qatar 🇶🇦", group: "B", confederation: "AFC", population: "2.9M", fifaRanking: 55 },
  { id: 8, name: "Bosnia & Herzegovina 🇧🇦", group: "B", confederation: "UEFA", population: "3.2M", fifaRanking: 74 }, 

  // GROUP C
  { id: 9, name: "Brazil 🇧🇷", group: "C", confederation: "CONMEBOL", population: "215.3M", fifaRanking: 6 },
  { id: 10, name: "Morocco 🇲🇦", group: "C", confederation: "CAF", population: "37.4M", fifaRanking: 8 },
  { id: 11, name: "Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", confederation: "UEFA", population: "5.4M", fifaRanking: 43 },
  { id: 12, name: "Haiti 🇭🇹", group: "C", confederation: "CONCACAF", population: "11.5M", fifaRanking: 83 },

  // GROUP D
  { id: 13, name: "USA 🇺🇸", group: "D", confederation: "CONCACAF", population: "333.2M", fifaRanking: 16 },
  { id: 14, name: "Türkiye 🇹🇷", group: "D", confederation: "UEFA", population: "85.3M", fifaRanking: 22 },
  { id: 15, name: "Australia 🇦🇺", group: "D", confederation: "AFC", population: "26.0M", fifaRanking: 27 },
  { id: 16, name: "Paraguay 🇵🇾", group: "D", confederation: "CONMEBOL", population: "7.3M", fifaRanking: 40 },

  // GROUP E
  { id: 17, name: "Germany 🇩🇪", group: "E", confederation: "UEFA", population: "83.3M", fifaRanking: 10 },
  { id: 18, name: "Ecuador 🇪🇨", group: "E", confederation: "CONMEBOL", population: "18.0M", fifaRanking: 23 },
  { id: 19, name: "Ivory Coast 🇨🇮", group: "E", confederation: "CAF", population: "28.1M", fifaRanking: 34 },
  { id: 20, name: "Curaçao 🇨🇼", group: "E", confederation: "CONCACAF", population: "0.15M", fifaRanking: 82 },

  // GROUP F
  { id: 21, name: "Netherlands 🇳🇱", group: "F", confederation: "UEFA", population: "17.7M", fifaRanking: 7 },
  { id: 22, name: "Japan 🇯🇵", group: "F", confederation: "AFC", population: "125.1M", fifaRanking: 18 },
  { id: 23, name: "Sweden 🇸🇪", group: "F", confederation: "UEFA", population: "10.5M", fifaRanking: 38 },
  { id: 24, name: "Tunisia 🇹🇳", group: "F", confederation: "CAF", population: "12.3M", fifaRanking: 44 },

  // GROUP G
  { id: 25, name: "Belgium 🇧🇪", group: "G", confederation: "UEFA", population: "11.6M", fifaRanking: 9 },
  { id: 26, name: "Iran 🇮🇷", group: "G", confederation: "AFC", population: "88.5M", fifaRanking: 21 },
  { id: 27, name: "Egypt 🇪🇬", group: "G", confederation: "CAF", population: "110.9M", fifaRanking: 29 },
  { id: 28, name: "New Zealand 🇳🇿", group: "G", confederation: "OFC", population: "5.1M", fifaRanking: 85 },

  // GROUP H
  { id: 29, name: "Spain 🇪🇸", group: "H", confederation: "UEFA", population: "47.7M", fifaRanking: 2 },
  { id: 30, name: "Uruguay 🇺🇾", group: "H", confederation: "CONMEBOL", population: "3.4M", fifaRanking: 17 },
  { id: 31, name: "Saudi Arabia 🇸🇦", group: "H", confederation: "AFC", population: "36.4M", fifaRanking: 53 },
  { id: 32, name: "Cape Verde 🇨🇻", group: "H", confederation: "CAF", population: "0.6M", fifaRanking: 65 },

  // GROUP I
  { id: 33, name: "France 🇫🇷", group: "I", confederation: "UEFA", population: "68.0M", fifaRanking: 1 },
  { id: 34, name: "Senegal 🇸🇳", group: "I", confederation: "CAF", population: "17.3M", fifaRanking: 14 },
  { id: 35, name: "Norway 🇳🇴", group: "I", confederation: "UEFA", population: "5.4M", fifaRanking: 31 },
  { id: 36, name: "Iraq 🇮🇶", group: "I", confederation: "AFC", population: "44.5M", fifaRanking: 57 },

  // GROUP J
  { id: 37, name: "Argentina 🇦🇷", group: "J", confederation: "CONMEBOL", population: "46.2M", fifaRanking: 3 },
  { id: 38, name: "Austria 🇦🇹", group: "J", confederation: "UEFA", population: "9.0M", fifaRanking: 24 },
  { id: 39, name: "Algeria 🇩🇿", group: "J", confederation: "CAF", population: "44.9M", fifaRanking: 28 },
  { id: 40, name: "Jordan 🇯🇴", group: "J", confederation: "AFC", population: "11.2M", fifaRanking: 71 },

  // GROUP K
  { id: 41, name: "Portugal 🇵🇹", group: "K", confederation: "UEFA", population: "10.3M", fifaRanking: 5 },
  { id: 42, name: "Colombia 🇨🇴", group: "K", confederation: "CONMEBOL", population: "51.8M", fifaRanking: 13 },
  { id: 43, name: "DR Congo 🇨🇩", group: "K", confederation: "CAF", population: "99.0M", fifaRanking: 46 },
  { id: 44, name: "Uzbekistan 🇺🇿", group: "K", confederation: "AFC", population: "35.6M", fifaRanking: 50 },

  // GROUP L
  { id: 45, name: "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", confederation: "UEFA", population: "56.0M", fifaRanking: 4 },
  { id: 46, name: "Croatia 🇭🇷", group: "L", confederation: "UEFA", population: "4.0M", fifaRanking: 11 },
  { id: 47, name: "Panama 🇵🇦", group: "L", confederation: "CONCACAF", population: "4.4M", fifaRanking: 33 },
  { id: 48, name: "Ghana 🇬🇭", group: "L", confederation: "CAF", population: "33.4M", fifaRanking: 68 },
];

const Mundial: React.FC = () => {
  return (
    <div className="container mt-5 mb-5">
      
{/* Header Section */}
      <div className="text-center mb-5 green-banner-bg">
        
        {/* Main Flexbox container holding the images and the text block */}
        <div className="d-flex justify-content-center align-items-center gap-4 mb-0">
          
          <img 
            src="/fwc.png" 
            alt="Left Logo" 
            style={{ height: '150px', width: 'auto' }} /* Feel free to crank this up! */
          />
          
          {/* This inner column locks the Title and Subtext together */}
          <div className="d-flex flex-column align-items-center">
            <h1 className="display-4 fw-bold text-white mb-0">
              FIFA World Cup 2026
            </h1>
            <p className="lead text-white-50 mt-1 mb-0">
              Tracking the expanded 48-team tournament on the global stage.
            </p>
          </div>
          
          <img 
            src="/fwc.png" 
            alt="Right Logo" 
            style={{ height: '150px', width: 'auto' }} /* Feel free to crank this up! */
          />
          
        </div>

      </div>

      {/* Grid of 48 Cards */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
        
        {teamsData.map((team) => (
          <div className="col" key={team.id}>
            <div className="card h-100 shadow-sm border-0 hover-card">
              
              <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
                <h3 className="h5 mb-0 fw-bold">{team.name}</h3>
                <span className="badge bg-light text-dark shadow-sm">Group {team.group}</span>
              </div>
              
              <div className="card-body bg-light">
                <ul className="list-unstyled mb-0">
                  <li className="mb-3 d-flex justify-content-between align-items-center">
                    <strong>Confederation:</strong> 
                    <span className="badge bg-secondary">{team.confederation}</span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between align-items-center">
                    <strong>Population:</strong> 
                    <span className="text-muted">{team.population}</span>
                  </li>
                  <li className="d-flex justify-content-between align-items-center">
                    <strong>FIFA Rank:</strong> 
                    <span className="fw-bold text-primary">
                      #{team.fifaRanking}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Back Button */}
      <div className="text-center mt-5">
        <Link to="/" className="btn btn-lg btn-custom-outline bg-dark text-white rounded-pill px-4 hover-card">
          ← Back to Resume
        </Link>
      </div>

    </div>
  );
};

export default Mundial;