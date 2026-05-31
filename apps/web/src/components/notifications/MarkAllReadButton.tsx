import { CheckCheck } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { markAllNotificationsRead } from '@/components/notifications/notificationSchema'

export function MarkAllReadButton({ disabled }: { disabled?: boolean }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  return (
    <Button
      size="sm"
      variant="outline"
      icon={<CheckCheck className="w-4 h-4" />}
      disabled={disabled}
      loading={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      Mark all read
    </Button>
  )
}
