import React, { useRef, useMemo } from 'react';
import { PlayerStats, TeamStats, ReceptionEvaluations, AttackEvaluations, ServiceEvaluations, DefenseEvaluations } from '../models/ScoutData';
import html2pdf from 'html2pdf.js';

function StatisticalReport({ playerStatsList, matchName }) {
    const reportRef = useRef();

    const { processedPlayerStats, teamStats } = useMemo(() => {
        if (!playerStatsList || playerStatsList.length === 0) {
            return { processedPlayerStats: [], teamStats: new TeamStats() };
        }

        const stats = playerStatsList.map(ps => {
            const validPlayerStats = new PlayerStats(ps.athlete);
            const fundamentals = { reception: ReceptionEvaluations, attack: AttackEvaluations, service: ServiceEvaluations, defense: DefenseEvaluations };

            Object.keys(fundamentals).forEach(fundName => {
                if (ps[fundName]) {
                    Object.values(fundamentals[fundName]).forEach(evalKey => {
                        validPlayerStats[fundName][evalKey] = ps[fundName][evalKey] || 0;
                    });
                }
            });

            validPlayerStats.calculateAllStats();
            return validPlayerStats;
        });

        const newTeamStats = new TeamStats();
        stats.forEach(ps => newTeamStats.addPlayer(ps));
        newTeamStats.calculateTeamTotals();

        return { processedPlayerStats: stats, teamStats: newTeamStats };
    }, [playerStatsList]);

    if (!processedPlayerStats || processedPlayerStats.length === 0) {
        return <div>No scouting data available to generate report.</div>;
    }

    const handleExportPdf = () => {
        const element = reportRef.current;
        const table = element.querySelector('table');
        table.classList.add('pdf-export-table');

        const opt = {
            margin: 0.5,
            filename: `${matchName || 'volleyball_scout_report'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            table.classList.remove('pdf-export-table'); // Cleanup after export
        });
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
                <td>{Math.round(data.positivity)}%</td>
                <td>{Math.round(data.efficiency)}%</td>
            </>
        );
    };

    const calculateColSpan = () => {
        const fixedStatsColumns = 3; // TOT, Pos%, Eff%
        return fixedStatsColumns + allUniqueEvaluationKeys.length;
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
                            <th colSpan={calculateColSpan()}>Service</th>
                            <th colSpan={calculateColSpan()}>Reception</th>
                            <th colSpan={calculateColSpan()}>Attack</th>
                            <th colSpan={calculateColSpan()}>Defense</th>
                        </tr>
                        <tr>
                            {/* Service Headers */}
                            <th>TOT</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`serv-${key}`}>{key}</th>)}
                            <th>Pos%</th>
                            <th>Eff%</th>

                            {/* Reception Headers */}
                            <th>TOT</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`rec-${key}`}>{key}</th>)}
                            <th>Pos%</th>
                            <th>Eff%</th>

                            {/* Attack Headers */}
                            <th>TOT</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`att-${key}`}>{key}</th>)}
                            <th>Pos%</th>
                            <th>Eff%</th>

                            {/* Defense Headers */}
                            <th>TOT</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`def-${key}`}>{key}</th>)}
                            <th>Pos%</th>
                            <th>Eff%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedPlayerStats.map((playerStats) => {
                            const athlete = playerStats.athlete;
                            return (
                                <tr key={athlete.jerseyNumber}>
                                    <td>{athlete.jerseyNumber}</td>
                                    <td>{athlete.name}</td>
                                    <td>{athlete.surname}</td>
                                    {renderFundamentalRow(playerStats.service, 'Service')}
                                    {renderFundamentalRow(playerStats.reception, 'Reception')}
                                    {renderFundamentalRow(playerStats.attack, 'Attack')}
                                    {renderFundamentalRow(playerStats.defense, 'Defense')}
                                </tr>
                            );
                        })}
                        <tr className="team-totals">
                            <td colSpan="3">DI SQUADRA</td>
                            {renderFundamentalRow(teamStats.teamService, 'Service')}
                            {renderFundamentalRow(teamStats.teamReception, 'Reception')}
                            {renderFundamentalRow(teamStats.teamAttack, 'Attack')}
                            {renderFundamentalRow(teamStats.teamDefense, 'Defense')}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StatisticalReport;