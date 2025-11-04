import React, { useRef } from 'react';
import { TeamStats, ReceptionEvaluations, AttackEvaluations, ServiceEvaluations, DefenseEvaluations } from '../models/ScoutData';
import html2pdf from 'html2pdf.js';

function StatisticalReport({ playerStatsList, matchName }) {
    const reportRef = useRef();

    if (!playerStatsList || playerStatsList.length === 0) {
        return <div>No scouting data available to generate report.</div>;
    }

    const teamStats = new TeamStats();
    playerStatsList.forEach(ps => teamStats.addPlayer(ps));
    teamStats.calculateTeamTotals();

    const handleExportPdf = () => {
        const element = reportRef.current;
        const opt = {
            margin: 0.5,
            filename: `${matchName || 'volleyball_scout_report'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const getEvaluationKeysForFundamental = (fundamentalName) => {
        switch (fundamentalName) {
            case 'Reception':
                return Object.values(ReceptionEvaluations);
            case 'Attack':
                return Object.values(AttackEvaluations);
            case 'Service':
                return Object.values(ServiceEvaluations);
            case 'Defense':
                return Object.values(DefenseEvaluations);
            default:
                return [];
        }
    };

    // Get all unique evaluation keys across all fundamentals for consistent column ordering
    const allUniqueEvaluationKeys = [...new Set([
        ...Object.values(ReceptionEvaluations),
        ...Object.values(AttackEvaluations),
        ...Object.values(ServiceEvaluations),
        ...Object.values(DefenseEvaluations)
    ])].sort();

    const renderFundamentalRow = (data, fundamentalName) => {
        const evaluationKeys = getEvaluationKeysForFundamental(fundamentalName);
        return (
            <>
                <td>{data.totalAttempts}</td>
                {allUniqueEvaluationKeys.map(key => (
                    <td key={key}>
                        {evaluationKeys.includes(key) ? (data[key] || 0) : '-'}
                    </td>
                ))}
                {fundamentalName === 'Attack' ? <td>{data.M}</td> : <td>-</td>}
                <td>{data.points}</td>
                <td>{data.errors}</td>
                <td>{data.efficiency.toFixed(2)}%</td>
                <td>{data.positivity.toFixed(2)}%</td>
            </>
        );
    };

    // Calculate colSpan for each fundamental header
    const calculateColSpan = (fundamentalName) => {
        const fixedStatsColumns = 4; // Punti, Errori, Eff%, Pos%
        const totColumn = 1; // TOT
        const muroColumn = 1; // Muro column is always present, but '-' for non-attack
        return totColumn + allUniqueEvaluationKeys.length + muroColumn + fixedStatsColumns;
    };

    return (
        <div className="statistical-report">
            <h2>Statistical Report {matchName && `for "${matchName}"`}</h2>
            <button onClick={handleExportPdf}>Export to PDF</button>
            <div ref={reportRef}>
                <table>
                    <thead>
                        <tr>
                            <th rowSpan="2">#</th>
                            <th rowSpan="2">Name</th>
                            <th rowSpan="2">Surname</th>
                            <th colSpan={calculateColSpan('Reception')}>Reception</th>
                            <th colSpan={calculateColSpan('Attack')}>Attack</th>
                            <th colSpan={calculateColSpan('Service')}>Service</th>
                            <th colSpan={calculateColSpan('Defense')}>Defense</th>
                        </tr>
                        <tr>
                            {/* Reception Headers */}
                            <th>TOT</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`rec-${key}`}>{key}</th>)}
                            <th>M</th>
                            <th>Punti</th>
                            <th>Errori</th>
                            <th>Eff%</th>
                            <th>Pos%</th>

                            {/* Attack Headers */}
                            <th>TOT</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`att-${key}`}>{key}</th>)}
                            <th>M</th>
                            <th>Punti</th>
                            <th>Errori</th>
                            <th>Eff%</th>
                            <th>Pos%</th>

                            {/* Service Headers */}
                            <th>TOT</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`serv-${key}`}>{key}</th>)}
                            <th>M</th>
                            <th>Punti</th>
                            <th>Errori</th>
                            <th>Eff%</th>
                            <th>Pos%</th>

                            {/* Defense Headers */}
                            <th>TOT</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`def-${key}`}>{key}</th>)}
                            <th>M</th>
                            <th>Punti</th>
                            <th>Errori</th>
                            <th>Eff%</th>
                            <th>Pos%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerStatsList.map((playerStats) => {
                            playerStats.calculateAllStats();
                            const athlete = playerStats.athlete;
                            return (
                                <tr key={athlete.jerseyNumber}>
                                    <td>{athlete.jerseyNumber}</td>
                                    <td>{athlete.name}</td>
                                    <td>{athlete.surname}</td>
                                    {renderFundamentalRow(playerStats.reception, 'Reception')}
                                    {renderFundamentalRow(playerStats.attack, 'Attack')}
                                    {renderFundamentalRow(playerStats.service, 'Service')}
                                    {renderFundamentalRow(playerStats.defense, 'Defense')}
                                </tr>
                            );
                        })}
                        {/* Team Totals Row */}
                        <tr className="team-totals">
                            <td colSpan="3">DI SQUADRA</td>
                            {renderFundamentalRow(teamStats.teamReception, 'Reception')}
                            {renderFundamentalRow(teamStats.teamAttack, 'Attack')}
                            {renderFundamentalRow(teamStats.teamService, 'Service')}
                            {renderFundamentalRow(teamStats.teamDefense, 'Defense')}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StatisticalReport;