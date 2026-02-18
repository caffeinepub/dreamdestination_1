import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Destination, ContactInquiry, Booking, TransportOption } from '../backend';
import { BookingType } from '../backend';

export function useDestinations() {
  const { actor, isFetching } = useActor();

  return useQuery<Destination[]>({
    queryKey: ['destinations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDestinations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDestinationById(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Destination>({
    queryKey: ['destination', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getDestinationById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitContactInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const timestamp = BigInt(Date.now() * 1_000_000);
      await actor.submitContactInquiry(data.name, data.email, data.message, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInquiries'] });
    },
  });
}

export function useContactInquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInquiry[]>({
    queryKey: ['contactInquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTransportOptionsByDestination(destinationId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<TransportOption[]>({
    queryKey: ['transportOptions', destinationId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransportOptionsByDestination(destinationId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTransportOptionById(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<TransportOption>({
    queryKey: ['transportOption', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getTransportOptionById(id);
    },
    enabled: !!actor && !isFetching && id > 0n,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { 
      bookingType: 'flight' | 'train'; 
      details: string;
      transportOptionId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const createdAt = BigInt(Date.now() * 1_000_000);
      const bookingTypeEnum: BookingType = data.bookingType === 'flight' ? BookingType.flight : BookingType.train;
      
      try {
        const bookingId = await actor.createBooking(
          bookingTypeEnum, 
          data.details, 
          createdAt, 
          data.transportOptionId
        );
        return bookingId;
      } catch (error: any) {
        // Map backend errors to user-friendly messages
        const errorMessage = error.message || String(error);
        if (errorMessage.includes('No available seats')) {
          throw new Error('Sorry, there are no available seats for this option.');
        }
        if (errorMessage.includes('Transport option not found')) {
          throw new Error('The selected transport option is no longer available.');
        }
        if (errorMessage.includes('does not match')) {
          throw new Error('Booking type does not match the transport option.');
        }
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
      // Invalidate transport options to refresh seat availability
      queryClient.invalidateQueries({ queryKey: ['transportOptions'] });
      queryClient.invalidateQueries({ queryKey: ['transportOption', variables.transportOptionId.toString()] });
    },
  });
}

export function useMyBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['myBookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      const bookings = await actor.getBookingsByCaller();
      // Sort by createdAt descending (newest first)
      return bookings.sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !isFetching,
  });
}
