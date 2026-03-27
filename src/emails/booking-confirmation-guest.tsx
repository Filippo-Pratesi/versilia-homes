import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
} from '@react-email/components';

export interface BookingConfirmationGuestProps {
  guestName: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  estimatedPrice: number | null;
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

export const subjectBookingConfirmationGuest = (
  propertyTitle: string
): string => `Richiesta ricevuta — ${propertyTitle}`;

export default function BookingConfirmationGuest({
  guestName,
  propertyTitle,
  checkIn,
  checkOut,
  guestsCount,
  estimatedPrice,
}: BookingConfirmationGuestProps) {
  const firstName = guestName.split(' ')[0];

  return (
    <Html lang="it">
      <Head />
      <Preview>
        Abbiamo ricevuto la tua richiesta per {propertyTitle}. Ti risponderemo
        presto!
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.headerLogo}>Viareggio Homes</Text>
            <Text style={styles.headerTagline}>
              Appartamenti sul Mar Tirreno
            </Text>
          </Section>

          {/* Main content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>Ciao {firstName},</Text>

            <Text style={styles.introText}>
              Grazie per aver scelto Viareggio Homes! Abbiamo ricevuto la tua
              richiesta di prenotazione per{' '}
              <strong style={styles.emphasis}>{propertyTitle}</strong>.
            </Text>

            {/* Confirmation badge */}
            <Section style={styles.confirmationBadge}>
              <Text style={styles.confirmationIcon}>✓</Text>
              <Text style={styles.confirmationText}>Richiesta ricevuta</Text>
            </Section>

            <Hr style={styles.divider} />

            {/* Summary */}
            <Text style={styles.sectionTitle}>Riepilogo della richiesta</Text>

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

            <Hr style={styles.divider} />

            {/* Response time */}
            <Section style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Cosa succede ora?</Text>
              <Text style={styles.infoBoxText}>
                Il nostro team esaminerà la tua richiesta e ti risponderà
                entro <strong>24 ore</strong> per confermare la disponibilità e
                fornirti tutte le informazioni necessarie.
              </Text>
            </Section>

            <Hr style={styles.divider} />

            {/* Contact */}
            <Text style={styles.contactTitle}>Hai domande?</Text>
            <Text style={styles.contactText}>
              Per qualsiasi informazione puoi contattarci:
            </Text>
            <Text style={styles.contactItem}>
              Email:{' '}
              <a href="mailto:prenotazioni@versiliahomes.it" style={styles.link}>
                prenotazioni@versiliahomes.it
              </a>
            </Text>
            <Text style={styles.contactItem}>
              WhatsApp:{' '}
              <a href="https://wa.me/393471234567" style={styles.link}>
                +39 347 123 4567
              </a>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Viareggio Homes — Via della Pineta, Viareggio (LU)
            </Text>
            <Text style={styles.footerText}>
              Hai ricevuto questa email perché hai inviato una richiesta di
              prenotazione su versiliahomes.it
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
  greeting: {
    fontSize: '22px',
    color: '#2C1810',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
  },
  introText: {
    fontSize: '15px',
    color: '#5C4A3A',
    lineHeight: '1.7',
    margin: '0 0 24px 0',
  },
  emphasis: {
    color: '#C2714F',
  },
  confirmationBadge: {
    backgroundColor: '#F0F7F0',
    border: '1px solid #C3E0C3',
    borderRadius: '8px',
    padding: '16px 24px',
    textAlign: 'center',
    margin: '0 0 24px 0',
  },
  confirmationIcon: {
    fontSize: '28px',
    color: '#4A8A4A',
    margin: '0 0 4px 0',
  },
  confirmationText: {
    fontSize: '16px',
    color: '#4A8A4A',
    fontWeight: 'bold',
    margin: 0,
  },
  divider: {
    borderTop: '1px solid #E8DDD5',
    margin: '24px 0',
  },
  sectionTitle: {
    fontSize: '13px',
    color: '#C2714F',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    margin: '0 0 12px 0',
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
  infoBox: {
    backgroundColor: '#FDF8F4',
    border: '1px solid #E8DDD5',
    borderLeft: '3px solid #C2714F',
    borderRadius: '4px',
    padding: '20px',
  },
  infoBoxTitle: {
    fontSize: '15px',
    color: '#2C1810',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  infoBoxText: {
    fontSize: '14px',
    color: '#5C4A3A',
    lineHeight: '1.6',
    margin: 0,
  },
  contactTitle: {
    fontSize: '16px',
    color: '#2C1810',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  contactText: {
    fontSize: '14px',
    color: '#5C4A3A',
    margin: '0 0 8px 0',
  },
  contactItem: {
    fontSize: '14px',
    color: '#5C4A3A',
    margin: '0 0 6px 0',
  },
  link: {
    color: '#C2714F',
    textDecoration: 'none',
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
