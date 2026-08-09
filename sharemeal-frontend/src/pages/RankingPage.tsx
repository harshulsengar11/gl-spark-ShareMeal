import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Alert,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useAuth } from '../contexts/AuthContext';
import * as foodService from '../services/foodService';
import { extractErrorMessage } from '../services/api';
import type { DonorRanking } from '../types';
import Loader from '../components/Loader';
import './RankingPage.css';

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <Box className="rank-badge rank-badge--gold">
        <EmojiEventsIcon fontSize="small" />
        <span>1</span>
      </Box>
    );
  }
  if (rank === 2) {
    return (
      <Box className="rank-badge rank-badge--silver">
        <MilitaryTechIcon fontSize="small" />
        <span>2</span>
      </Box>
    );
  }
  if (rank === 3) {
    return (
      <Box className="rank-badge rank-badge--bronze">
        <WorkspacePremiumIcon fontSize="small" />
        <span>3</span>
      </Box>
    );
  }
  return (
    <Box className="rank-badge">
      <span>{rank}</span>
    </Box>
  );
}

function RankingPage() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<DonorRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await foodService.getDonorRanking();
        if (active) setRanking(data);
      } catch (err) {
        if (active) setError(extractErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Box className="ranking-page page-container">
      <Box className="ranking-header">
        <Box>
          <Typography variant="overline" className="ranking-eyebrow">
            Leaderboard
          </Typography>
          <Typography variant="h4" className="ranking-title">
            Top donors
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The top 10 donors ranked by how much surplus food they've actually
            gotten into the hands of NGOs and buyers.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" className="ranking-alert">
          {error}
        </Alert>
      )}

      {loading ? (
        <Loader label="Loading rankings…" />
      ) : ranking.length === 0 ? (
        <Box className="ranking-empty">
          <Typography variant="body1" color="text.secondary">
            No donations have been fulfilled yet — the leaderboard will fill up
            as NGOs start claiming food.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} className="ranking-table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="ranking-th">Rank</TableCell>
                <TableCell className="ranking-th">Donor</TableCell>
                <TableCell className="ranking-th" align="center">
                  Donations fulfilled
                </TableCell>
                <TableCell className="ranking-th" align="right">
                  Total quantity donated
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ranking.map((entry, index) => {
                const rank = index + 1;
                const isMe = user?.email === entry.donorEmail;
                return (
                  <TableRow
                    key={entry.donorEmail}
                    className={`ranking-row ${isMe ? 'ranking-row--me' : ''}`}
                  >
                    <TableCell>
                      <RankBadge rank={rank} />
                    </TableCell>
                    <TableCell>
                      <Box className="ranking-donor-cell">
                        <Avatar className="ranking-avatar">
                          {entry.donorName?.[0]?.toUpperCase() ?? 'D'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {entry.donorName}
                            {isMe && (
                              <Chip
                                label="You"
                                size="small"
                                className="ranking-you-chip"
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {entry.donorEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">{entry.totalDonations}</TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" className="ranking-quantity">
                        {entry.totalQuantity}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default RankingPage;
