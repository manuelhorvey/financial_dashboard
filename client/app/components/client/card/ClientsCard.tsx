import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ClientsCardProps {
  _id: string;
  name: string;
  phone: string;
  location: string;
  grosscommission: number;
  winscommission: number;
  isActive?: boolean;
  imageSrc: string;
}

const ClientsCard: React.FC<ClientsCardProps> = ({
  _id,
  name,
  phone,
  location,
  grosscommission,
  winscommission,
  isActive,
  imageSrc,
}) => {

  const router = useRouter();
  const handleViewClick=(()=>{
    router.push( `/dashboard/clients/statements?clientid=${_id}&&C=${grosscommission} `)
  })
  return (
    <Card sx={{ maxWidth: 320, padding: '10px' }}>
      <CardMedia
        sx={{ objectFit: 'contain' }}
        component="img"
        alt={name}
        height="120"
        image={imageSrc || '/usernew.png'}
      />
      <CardContent>
        <Typography
          bgcolor={'#f0f0f0'}
          padding={'10px'}
          display='flex'
          justifyContent={'space-between'}
          gutterBottom
          variant="h5"
          component="div"
        >
          <Typography
            variant='h5'
            flexDirection={'column'}
            marginRight={'30px'}
            color="text.secondary"
          >
            {name}
            <Typography variant='caption' display={'flex'}>
              {phone}
            </Typography>
          </Typography>
          <Typography
            variant="body2"
            flex={'right'}
            color="text.secondary"
            component="div"
          >
            {location}
            <Typography variant="body2" color="text.secondary">
              {grosscommission} | {winscommission}
            </Typography>
          </Typography>
        </Typography>
        <Typography variant="body2" color={isActive ? 'green' : 'red'} sx={{ marginTop: '10px' }}>
          {isActive ? 'Active' : 'Inactive'}
        </Typography>
      </CardContent>
      <CardActions>
        <Link href={`/dashboard/clients/${_id}`} passHref>
          <Button size="small">Edit</Button>
        </Link>
          <Button size="small" onClick={handleViewClick}>View Statement</Button>
      </CardActions>
    </Card>
  );
};

export default ClientsCard;
