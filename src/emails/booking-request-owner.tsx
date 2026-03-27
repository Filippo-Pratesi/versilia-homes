import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
} from '@react-email/components';

export interface BookingRequestOwnerProps {
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  message: string | null;
  estimatedPrice: number | null;
  propertyTitle: string;
  adminUrl: string;
}

const formatDateItalian = (dateStr: string): string => {
  return new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(
    new Date(dateStr)
  );
};

const formatPrice = (price: number | null): string => {
  if (price == null) return 'Da calcolare';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const subjectBookingRequestOwner = (
  propertyTitle: string,
  checkIn: string,
  checkOut: string
): string =>
  `Nuova richiesta per ${propertyTitle} — ${formatDateItalian(checkIn)} → ${formatDateItalian(checkOut)}`;

export default function BookingRequestOwner({
  guestName,
  guestEmail,
  guestPhone,
  checkIn,
  checkOut,
  guestsCount,
  message,
  estimatedPrice,
  propertyTitle,
  adminUrl,
}: BookingRequestOwnerProps) {
  return (
    <Html lang="it">
      <Head />
      <Preview>
        Nuova richiesta da {guestName} per {propertyTitle}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.headerLogo}>Viareggio Homes</Text>
            <Text style={styles.headerTagline}>Pannello Proprietario</Text>
          </Section>

          {/* Title */}
          <Section style={styles.content}>
            <Text style={styles.heading}>Nuova richiesta di prenotazione</Text>
            <Text style={styles.subheading}>
              Hai ricevuto una nuova richiesta per{' '}
              <strong>{propertyTitle}</strong>.
            </Text>

            <Hr style={styles.divider} />

            {/* Guest details table */}
            <Text style={styles.sectionTitle}>Dettagli ospite</Text>

            <table style={styles.table}>
              <tbody>
                <tr>
                  <td style={styles.tableLabel}>Nome</td>
                  <td style={styles.tableValue}>{guestName}</td>
                </tr>
                <tr>
                  <td style={styles.tableLabel}>Email</td>
                  <td style={styles.tableValue}>
                    <a href={`mailto:${guestEmail}`} style={styles.link}>
                      {guestEmail}
                    </a>
                  </td>
                </tr>
                {guestPhone && (
                  <tr>
                    <td style={styles.tableLabel}>Telefono</td>
                    <td style={styles.tableValue}>
                      <a href={`tel:${guestPhone}`} style={styles.link}>
                        {guestPhone}
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Hr style={styles.divider} />

            {/* Booking details */}
            <Text style={styles.sectionTitle}>Dettagli soggiorno</Text>

            <table style={styles.table}>
              <tbody>
                <tr>
                  <td style={styles.tableLabel}>Proprietà</td>
                  <td style={styles.tableValue}>{propertyTitle}</td>
                </tr>
                <tr>
                  <td style={styles.tableLabel}>Check-in</td>
                  <td style={styles.tableValue}>{formatDateItalian(checkIn)}</td>
                </tr>
                <tr>
                  <td style={styles.tableLabel}>Check-out</td>
                  <td style={styles.tableValue}>{formatDateItalian(checkOut)}</td>
                </tr>
                <tr>
                  <td style={styles.tableLabel}>Ospiti</td>
                  <td style={styles.tableValue}>{guestsCount}</td>
                </tr>
                <tr>
                  <td style={styles.tableLabel}>Prezzo stimato</td>
                  <td style={{ ...styles.tableValue, ...styles.priceHighlight }}>
                    {formatPrice(estimatedPrice)}
                  </td>
                </tr>
              </tbody>
            </table>

            {message && (
              <>
                <Hr style={styles.divider} />
                <Text style={styles.sectionTitle}>Messaggio dell&apos;ospite</Text>
                <Text style={styles.messageBox}>{message}</Text>
              </>
            )}

            <Hr style={styles.divider} />

            {/* CTA */}
            <Text style={styles.ctaText}>
              Accedi al pannello di amministrazione per confermare o rifiutare
              questa richiesta.
            </Text>

            <Section style={styles.buttonContainer}>
              <Button href={adminUrl} style={styles.button}>
                Gestisci richiesta
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Viareggio Homes — Via della Pineta, Viareggio (LU)
            </Text>
            <Text style={styles.footerText}>
              Hai ricevuto questa email perché sei registrato come proprietario
              su Viareggio Homes.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: '#F5F0EB',
    fontFamily: 'Georgia, serif',
    margin: 0,
    padding: '20px 0',
  },
  container: {
    backgroundColor: '#FFFFFF',
    maxWidth: '600px',
    margin: '0 auto',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  header: {
    backgroundColor: '#C2714F',
    padding: '32px 40px',
    textAlign: 'center',
  },
  headerLogo: {
    color: '#FFFFFF',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    letterSpacing: '1px',
  },
  headerTagline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
    margin: 0,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  content: {
    padding: '40px',
  },
  heading: {
    fontSize: '24px',
    color: '#2C1810',
    margin: '0 0 8px 0',
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: '15px',
    color: '#5C4A3A',
    margin: '0 0 24px 0',
    lineHeight: '1.6',
  },
  sectionTitle: {
    fontSize: '13px',
    color: '#C2714F',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    margin: '0 0 12px 0',
  },
  divider: {
    borderTop: '1px solid #E8DDD5',
    margin: '24px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableLabel: {
    fontSize: '14px',
    color: '#8C7B6E',
    paddingBottom: '10px',
    paddingRight: '16px',
    width: '140px',
    verticalAlign: 'top',
  },
  tableValue: {
    fontSize: '14px',
    color: '#2C1810',
    paddingBottom: '10px',
    fontWeight: '500',
  },
  priceHighlight: {
    color: '#C2714F',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  link: {
    color: '#C2714F',
    textDecoration: 'none',
  },
  messageBox: {
    backgroundColor: '#F9F4EF',
    border: '1px solid #E8DDD5',
    borderLeft: '3px solid #C2714F',
    borderRadius: '4px',
    padding: '16px',
    fontSize: '14px',
    color: '#3D2B1F',
    lineHeight: '1.6',
    fontStyle: 'italic',
    margin: '0',
  },
  ctaText: {
    fontSize: '14px',
    color: '#5C4A3A',
    margin: '0 0 20px 0',
    lineHeight: '1.6',
  },
  buttonContainer: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#C2714F',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 'bold',
    padding: '14px 32px',
    borderRadius: '6px',
    textDecoration: 'none',
    display: 'inline-block',
    letterSpacing: '0.5px',
  },
  footer: {
    backgroundColor: '#F9F4EF',
    padding: '24px 40px',
    borderTop: '1px solid #E8DDD5',
  },
  footerText: {
    fontSize: '12px',
    color: '#8C7B6E',
    margin: '0 0 4px 0',
    textAlign: 'center',
    lineHeight: '1.5',
  },
};
