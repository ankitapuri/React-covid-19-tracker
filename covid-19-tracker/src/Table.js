import React from 'react'
import './Table.css';
function Table({countries}) {
    return (
        <div className="table">
            {countries.map(({country,cases}) =>(
                <tr>
                    <td>{country}</td>
                    <td><strong>{cases}</strong></td>
                </tr>
            ))}
            
        </div>
    );
}

export default Table;
