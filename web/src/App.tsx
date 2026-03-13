import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import type { AuthResponse } from '../../shared/types/auth.js';
import { loadSession, loginUser, logoutSession, refreshSession, registerUser } from './auth/api.js';

type AuthMode = 'register' | 'login';

type FormState = {
  email: string;
  fullName: string;
  password: string;
};

const STORAGE_KEY = 'ehe-auth-session';

function readStoredSession() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as AuthResponse;
}

function writeStoredSession(session: AuthResponse | null) {
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export default function App() {
  const [mode, setMode] = useState<AuthMode>('register');
  const [form, setForm] = useState<FormState>({
    email: '',
    fullName: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [session, setSession] = useState<AuthResponse | null>(() => readStoredSession());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    void loadSession(session.accessToken)
      .then(() => {
        setError(null);
      })
      .catch(async () => {
        try {
          const refreshed = await refreshSession(session.refreshToken);
          setSession(refreshed);
          writeStoredSession(refreshed);
        } catch {
          setSession(null);
          writeStoredSession(null);
        }
      });
  }, [session]);

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const nextSession =
        mode === 'register'
          ? await registerUser(form)
          : await loginUser({ email: form.email, password: form.password });
      setSession(nextSession);
      writeStoredSession(nextSession);
      setMessage(mode === 'register' ? 'Account created.' : 'Welcome back.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to authenticate.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRefresh() {
    if (!session) {
      return;
    }

    const nextSession = await refreshSession(session.refreshToken);
    setSession(nextSession);
    writeStoredSession(nextSession);
    setMessage('Session rotated.');
  }

  async function handleLogout() {
    if (!session) {
      return;
    }

    await logoutSession(session.refreshToken);
    setSession(null);
    writeStoredSession(null);
    setMessage('Signed out.');
  }

  return (
    <Box
      sx={{
        background:
          'radial-gradient(circle at top left, rgba(233,30,140,0.12), transparent 34%), linear-gradient(180deg, #fff8fc 0%, #ffffff 45%, #eef5ff 100%)',
        minHeight: '100vh',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ md: 'row', xs: 'column' }} spacing={4}>
          <Card
            elevation={0}
            sx={{
              bgcolor: 'rgba(255,255,255,0.86)',
              border: '1px solid rgba(13,13,13,0.08)',
              flex: 1.1,
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Stack spacing={3}>
                <Chip color="secondary" label="Slice 1 live demo" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="h2">EHEStudio Ops</Typography>
                <Typography color="text.secondary" variant="h6">
                  Auth is now live with register, login, refresh, and logout flows wired for both web and mobile.
                </Typography>
                <Divider />
                <Stack direction={{ sm: 'row', xs: 'column' }} spacing={2}>
                  <Metric label="Module" value="Auth foundation" />
                  <Metric label="Session mode" value="Access + refresh" />
                  <Metric label="E2E target" value="Web + mobile" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid rgba(13,13,13,0.08)',
              flex: 0.9,
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              {session ? (
                <Stack spacing={2}>
                  <Typography variant="h4">Dashboard</Typography>
                  <Typography data-testid="dashboard-name" variant="body1">
                    {session.user.fullName}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {session.user.email}
                  </Typography>
                  <Stack direction={{ sm: 'row', xs: 'column' }} spacing={2}>
                    <Button data-testid="refresh-button" onClick={() => void handleRefresh()} variant="outlined">
                      Refresh session
                    </Button>
                    <Button
                      color="secondary"
                      data-testid="logout-button"
                      onClick={() => void handleLogout()}
                      variant="contained"
                    >
                      Log out
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  <Tabs
                    onChange={(_event, value: AuthMode) => setMode(value)}
                    value={mode}
                    variant="fullWidth"
                  >
                    <Tab label="Register" value="register" />
                    <Tab label="Login" value="login" />
                  </Tabs>
                  {error ? <Alert severity="error">{error}</Alert> : null}
                  {message ? <Alert severity="success">{message}</Alert> : null}
                  <TextField
                    data-testid="email-input"
                    label="Email"
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    type="email"
                    value={form.email}
                  />
                  {mode === 'register' ? (
                    <TextField
                      data-testid="full-name-input"
                      label="Full name"
                      onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                      value={form.fullName}
                    />
                  ) : null}
                  <TextField
                    data-testid="password-input"
                    label="Password"
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    type="password"
                    value={form.password}
                  />
                  <Button
                    data-testid="submit-auth-button"
                    disabled={isSubmitting}
                    onClick={() => void handleSubmit()}
                    size="large"
                    variant="contained"
                  >
                    {mode === 'register' ? 'Create account' : 'Login'}
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      spacing={0.5}
      sx={{
        backgroundColor: 'rgba(30,111,233,0.08)',
        borderRadius: 3,
        minWidth: 0,
        p: 2,
      }}
    >
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Stack>
  );
}
