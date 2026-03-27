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

export interface BookingStatusChangeProps {
  guestName: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'declined';
  ownerEmail: string;
  ownerWhatsApp: string | null;
}

const statusLabel = (status: 'confirmed' | 'declined'): string =>
  status === 'confirmed' ? 'confermata' : 'rifiutata';

export const subjectBookingStatusChange = (
  propertyTitle: string,
  status: 'confirmed' | 'declined'
): string =>
  `La tua richiesta per ${propertyTitle} è stata ${statusLabel(status)}`;

export default function BookingStatusChange({
  guestName,
  propertyTitle,
  checkIn,
  checkOut,
  status,
  ownerEmail,
  ownerWhatsApp,
}: BookingStatusChangeProps) {
  const firstName = guestName.split(' ')[0];
  const isConfirmed = status === 'confirmed';

  const whatsAppUrl = ownerWhatsApp
    ? `https://wa.me/${ownerWhatsApp.replace(/\D/g, '')}`
    : null;

  return (
    <Html lang="it">
      <Head />
      <Preview>
        {isConfirmed
          ? `La tua prenotazione per ${propertyTitle} è confermata!`
          : `Aggiornamento sulla tua richiesta per ${propertyTitle}`}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section
            style={{
              ...styles.header,
              backgroundColor: isConfirmed ? '#C2714F' : '#8C7B6E',
            }}
          >
            <Text style={styles.headerLogo}>Versilia Homes</Text>
            <Text style={styles.headerTagline}>
              {isConfirmed ? 'Prenotazione Confermata' : 'Aggiornamento Richiesta'}
            </Text>
          </Section>

          {/* Main content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>Ciao {firstName},</Text>

            {isConfirmed ? (
              <ConfirmedContent
                propertyTitle={propertyTitle}
                checkIn={checkIn}
                checkOut={checkOut}
                ownerEmail={ownerEmail}
                whatsAppUrl={whatsAppUrl}
              />
            ) : (
              <DeclinedContent
                propertyTitle={propertyTitle}
                checkIn={checkIn}
                checkOut={checkOut}
                ownerEmail={ownerEmail}
              />
            )}
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Versilia Homes — Via della Pineta, Viareggio (LU)
            </Text>
            <Text style={styles.footerText}>
              Hai ricevuto questa email in risposta alla tua richiesta di
              prenotazione su versiliahomes.it
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

interface ConfirmedContentProps {
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  ownerEmail: string;
  whatsAppUrl: string | null;
}

function ConfirmedContent({
  propertyTitle,
  checkIn,
  checkOut,
  ownerEmail,
  whatsAppUrl,
}: ConfirmedContentProps) {
  return (
    <>
      <Text style={styles.introText}>
        Ottime notizie! La tua richiesta per{' '}
        <strong style={styles.emphasisPositive}>{propertyTitle}</strong> è stata{' '}
        <strong>confermata</strong>. Non vediamo l&apos;ora di accoglierti!
      </Text>

      {/* Confirmation badge */}
      <Section style={styles.confirmedBadge}>
        <Text style={styles.badgeIcon}>🏖</Text>
        <Text style={styles.badgeText}>Prenotazione confermata</Text>
        <Text style={styles.badgeDates}>
          {new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(
            new Date(checkIn)
          )}{' '}
          →{' '}
          {new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(
            new Date(checkOut)
          )}
        </Text>
      </Section>

      <Hr style={styles.divider} />

      <Text style={styles.sectionTitle}>Istruzioni per il pagamento</Text>
      <Text style={styles.bodyText}>
        Per completare la prenotazione, ti chiediamo di contattare il
        proprietario entro <strong>48 ore</strong> per concordare le modalità
        di pagamento e ricevere le istruzioni per il check-in.
      </Text>

      <Hr style={styles.divider} />

      <Text style={styles.sectionTitle}>Contatta il proprietario</Text>
      <Text style={styles.bodyText}>
        Usa i canali qui sotto per organizzare i dettagli del tuo soggiorno:
      </Text>

      <Text style={styles.contactItem}>
        Email:{' '}
        <a href={`mailto:${ownerEmail}`} style={styles.link}>
          {ownerEmail}
        </a>
      </Text>

      {whatsAppUrl && (
        <>
          <Text style={styles.contactItem}>
            WhatsApp:{' '}
            <a href={whatsAppUrl} style={styles.link}>
              Scrivi su WhatsApp
            </a>
          </Text>
          <Section style={styles.buttonContainer}>
            <Button href={whatsAppUrl} style={styles.button}>
              Contatta su WhatsApp
            </Button>
          </Section>
        </>
      )}
    </>
  );
}

interface DeclinedContentProps {
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  ownerEmail: string;
}

function DeclinedContent({
  propertyTitle,
  checkIn,
  checkOut,
  ownerEmail,
}: DeclinedContentProps) {
  return (
    <>
      <Text style={styles.introText}>
        Ci dispiace comunicarti che la tua richiesta per{' '}
        <strong>{propertyTitle}</strong> per il periodo{' '}
        <strong>
          {new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(
            new Date(checkIn)
          )}{' '}
          —{' '}
          {new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(
            new Date(checkOut)
          )}
        </strong>{' '}
        non ha potuto essere accettata.
      </Text>

      <Text style={styles.bodyText}>
        Può succedere per diversi motivi: l&apos;appartamento potrebbe essere già
        occupato per quel periodo, o potrebbero esserci restrizioni sulle date
        minime di soggiorno.
      </Text>

      <Hr style={styles.divider} />

      <Section style={styles.suggestionBox}>
        <Text style={styles.suggestionTitle}>Cosa puoi fare?</Text>
        <Text style={styles.suggestionText}>
          • Prova a cercare date alternative — potresti trovare disponibilità
          nelle settimane vicine.
        </Text>
        <Text style={styles.suggestionText}>
          • Esplora le altre proprietà su Versilia Homes.
        </Text>
        <Text style={styles.suggestionText}>
          • Contattaci direttamente per ricevere assistenza personalizzata.
        </Text>
      </Section>

      <Hr style={styles.divider} />

      <Text style={styles.sectionTitle}>Hai bisogno di aiuto?</Text>
      <Text style={styles.bodyText}>
        Siamo qui per aiutarti a trovare il soggiorno perfetto. Scrivici e
        troveremo insieme la soluzione migliore.
      </Text>

      <Text style={styles.contactItem}>
        Email:{' '}
        <a href={`mailto:${ownerEmail}`} style={styles.link}>
          {ownerEmail}
        </a>
      </Text>

      <Section style={styles.buttonContainer}>
        <Button href="https://versiliahomes.it" style={styles.buttonSecondary}>
          Cerca altre date
        </Button>
      </Section>
    </>
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
    color: 'rgba(255,255,255,0.85)',
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
  emphasisPositive: {
    color: '#C2714F',
  },
  confirmedBadge: {
    backgroundColor: '#FDF8F4',
    border: '2px solid #C2714F',
    borderRadius: '8px',
    padding: '20px 24px',
    textAlign: 'center',
    margin: '0 0 24px 0',
  },
  badgeIcon: {
    fontSize: '32px',
    margin: '0 0 8px 0',
  },
  badgeText: {
    fontSize: '18px',
    color: '#C2714F',
    fontWeight: 'bold',
    margin: '0 0 6px 0',
  },
  badgeDates: {
    fontSize: '14px',
    color: '#5C4A3A',
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
  bodyText: {
    fontSize: '14px',
    color: '#5C4A3A',
    lineHeight: '1.7',
    margin: '0 0 12px 0',
  },
  contactItem: {
    fontSize: '14px',
    color: '#5C4A3A',
    margin: '0 0 8px 0',
  },
  link: {
    color: '#C2714F',
    textDecoration: 'none',
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '24px',
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
  buttonSecondary: {
    backgroundColor: '#5C4A3A',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: 'bold',
    padding: '14px 32px',
    borderRadius: '6px',
    textDecoration: 'none',
    display: 'inline-block',
    letterSpacing: '0.5px',
  },
  suggestionBox: {
    backgroundColor: '#FDF8F4',
    border: '1px solid #E8DDD5',
    borderRadius: '6px',
    padding: '20px 24px',
  },
  suggestionTitle: {
    fontSize: '15px',
    color: '#2C1810',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
  },
  suggestionText: {
    fontSize: '14px',
    color: '#5C4A3A',
    lineHeight: '1.6',
    margin: '0 0 8px 0',
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
