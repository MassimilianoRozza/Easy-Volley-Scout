import React, { useRef, useMemo, useContext } from 'react';
import { PlayerStats, TeamStats, ReceptionEvaluations, AttackEvaluations, ServiceEvaluations, DefenseEvaluations } from '../models/ScoutData';
import html2pdf from 'html2pdf.js';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LanguageContext } from '../App';

// Style for Positivity (0% to 100%)
const getPositivityCellStyle = (value) => {
    if (value >= 75) return { backgroundColor: '#28a745', color: 'white' }; // Dark Green
    if (value >= 50) return { backgroundColor: '#82ca9d', color: 'black' }; // Light Green
    if (value > 0) return { backgroundColor: '#a8e6cf', color: 'black' };   // Lighter Green
    if (value === 0) return {}; // Neutral for 0
    return { backgroundColor: '#dc3545', color: 'white' }; // Red for any negative case (should not happen in positivity)
};

// Style for Efficiency (-100% to 100%)
const getEfficiencyCellStyle = (value) => {
    // Positive values (Green scale)
    if (value >= 75) return { backgroundColor: '#28a745', color: 'white' }; // Dark Green
    if (value >= 50) return { backgroundColor: '#82ca9d', color: 'black' }; // Light Green
    if (value > 0) return { backgroundColor: '#a8e6cf', color: 'black' };   // Lighter Green

    // Negative values (Red scale)
    if (value <= -50) return { backgroundColor: '#dc3545', color: 'white' }; // Dark Red
    if (value < 0) return { backgroundColor: '#f5c6cb', color: 'black' }; // Light Red

    return {}; // Neutral for 0
};

function StatisticalReport({ playerStatsList, matchName }) {
    const { t } = useContext(LanguageContext);
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
        return <div>{t('noScoutingData')}</div>;
    }

    const handleExportPdf = async () => {
        const element = reportRef.current;
        const table = element.querySelector('table');
        table.classList.add('pdf-export-table');

        const opt = {
            margin: 0.5,
            filename: `${matchName || t('volleyballScoutReport')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        if (Capacitor.isNativePlatform()) {
            try {
                const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
                const reader = new FileReader();
                reader.readAsDataURL(pdfBlob);
                reader.onloadend = async () => {
                    const base64data = reader.result;
                    await Filesystem.writeFile({
                        path: opt.filename,
                        data: base64data,
                        directory: Directory.Documents,
                    });
                    alert(t('pdfSavedToDocuments'));
                };
            } catch (error) {
                console.error('Error saving PDF:', error);
                alert(t('errorSavingPdf'));
            } finally {
                table.classList.remove('pdf-export-table');
            }
        } else {
            html2pdf().set(opt).from(element).save().then(() => {
                table.classList.remove('pdf-export-table'); // Cleanup after export
            });
        }
    };

    const getEvaluationKeysForFundamental = (fundamentalName) => {
        switch (fundamentalName) {
            case 'Service':
                return Object.values(ServiceEvaluations);
            case 'Reception':
                return Object.values(ReceptionEvaluations);
            case 'Attack':
                return Object.values(AttackEvaluations);
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
        const positivity = Math.round(data.positivity);
        const efficiency = Math.round(data.efficiency);

        // Do not apply color if there are no attempts
        if (data.totalAttempts === 0) {
            return (
                <>
                    <td>{data.totalAttempts}</td>
                    {allUniqueEvaluationKeys.map(key => (
                        <td key={key}>
                            {evaluationKeys.includes(key) ? (data[key] || 0) : '-'}
                        </td>
                    ))}
                    <td>{positivity}%</td>
                    <td>{efficiency}%</td>
                </>
            );
        }

        return (
            <>
                <td>{data.totalAttempts}</td>
                {allUniqueEvaluationKeys.map(key => (
                    <td key={key}>
                        {evaluationKeys.includes(key) ? (data[key] || 0) : '-'}
                    </td>
                ))}
                <td style={getPositivityCellStyle(positivity)}>{positivity}%</td>
                <td style={getEfficiencyCellStyle(efficiency)}>{efficiency}%</td>
            </>
        );
    };

    const calculateColSpan = () => {
        const fixedStatsColumns = 3; // TOT, Pos%, Eff%
        return fixedStatsColumns + allUniqueEvaluationKeys.length;
    };

    return (
        <div className="statistical-report">
            <button onClick={handleExportPdf}>{t('exportToPdf')}</button>
            <div ref={reportRef}>
                <table className="common-table">
                    <thead>
                        <tr>
                            <th rowSpan="2">#</th>
                            <th rowSpan="2">{t('name')}</th>
                            <th rowSpan="2">{t('surname')}</th>
                            <th colSpan={calculateColSpan()}>{t('service')}</th>
                            <th colSpan={calculateColSpan()}>{t('reception')}</th>
                            <th colSpan={calculateColSpan()}>{t('attack')}</th>
                            <th colSpan={calculateColSpan()}>{t('defense')}</th>
                        </tr>
                        <tr>
                            {/* Service Headers */}
                            <th>{t('total')}</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`serv-${key}`}>{key}</th>)}
                            <th>{t('positivity')}</th>
                            <th>{t('efficiency')}</th>

                            {/* Reception Headers */}
                            <th>{t('total')}</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`rec-${key}`}>{key}</th>)}
                            <th>{t('positivity')}</th>
                            <th>{t('efficiency')}</th>

                            {/* Attack Headers */}
                            <th>{t('total')}</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`att-${key}`}>{key}</th>)}
                            <th>{t('positivity')}</th>
                            <th>{t('efficiency')}</th>

                            {/* Defense Headers */}
                            <th>{t('total')}</th>
                            {allUniqueEvaluationKeys.map(key => <th key={`def-${key}`}>{key}</th>)}
                            <th>{t('positivity')}</th>
                            <th>{t('efficiency')}</th>
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
                            <td colSpan="3">{t('teamTotals')}</td>
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