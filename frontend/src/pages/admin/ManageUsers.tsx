import { useState } from 'react';
import { User, Search, Mail, Phone, Calendar, Shield, BadgeCheck, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { useUsers } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import api, { USER_SERVICE_URL } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import type { UserRole } from '@/types/user.types';

type Role = 'MEMBER' | 'LIBRARIAN' | 'ADMIN';

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  { value: 'MEMBER',    label: 'Member',    description: 'Peut emprunter des livres' },
  { value: 'LIBRARIAN', label: 'Librarian', description: 'Gère les emprunts et le catalogue' },
  { value: 'ADMIN',     label: 'Admin',     description: 'Accès total au système' },
];

const ManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [changingRoleFor, setChangingRoleFor] = useState<number | null>(null);
  const { data: usersData, isLoading } = useUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const users = usersData?.users || [];

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-destructive hover:bg-destructive/90"><Shield className="mr-1 h-3 w-3" /> Admin</Badge>;
      case 'LIBRARIAN':
        return <Badge className="bg-info hover:bg-info/90"><BadgeCheck className="mr-1 h-3 w-3" /> Librarian</Badge>;
      default:
        return <Badge variant="secondary"><User className="mr-1 h-3 w-3" />Member</Badge>;
    }
  };

  const handleRoleChange = async (userId: number, newRole: Role, userEmail: string) => {
    setChangingRoleFor(userId);
    try {
      await api.patch(`${USER_SERVICE_URL}/${userId}/role/`, { role: newRole });
      toast({
        title: '✅ Rôle mis à jour',
        description: `${userEmail} → ${newRole}`,
      });
      // Refresh users list (invalidate all user queries regardless of role filter)
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.response?.data?.error || 'Impossible de changer le rôle',
        variant: 'destructive',
      });
    } finally {
      setChangingRoleFor(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Manage Users</h1>
          <p className="text-muted-foreground">View and manage all registered library members</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {!isLoading && (
          <Badge variant="outline" className="h-10 px-4">
            {filteredUsers.length} Users Found
          </Badge>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Loans</TableHead>
                <TableHead className="text-right">Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading members...</p>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20">
                    <User className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No members found</h3>
                    <p className="text-muted-foreground">Try adjusting your search query</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group transition-colors hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            ID#{user.id} {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'secondary' : 'outline'} className={cn(
                        user.is_active && "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
                        !user.is_active && "text-muted-foreground"
                      )}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(user.date_joined).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <span className="font-medium">{user.max_loans}</span>
                        <p className="text-[10px] text-muted-foreground uppercase">Limit</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            disabled={changingRoleFor === user.id}
                          >
                            {changingRoleFor === user.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                {user.role}
                                <ChevronDown className="h-3 w-3" />
                              </>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Changer le rôle</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {ROLE_OPTIONS.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              disabled={user.role === option.value}
                              onClick={() => handleRoleChange(user.id, option.value, user.email)}
                              className={cn(
                                user.role === option.value && 'opacity-50 cursor-default',
                                option.value === 'ADMIN' && 'text-destructive focus:text-destructive',
                                option.value === 'LIBRARIAN' && 'text-info focus:text-info',
                              )}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{option.label}</span>
                                <span className="text-xs text-muted-foreground">{option.description}</span>
                              </div>
                              {user.role === option.value && (
                                <span className="ml-auto text-xs text-muted-foreground">actuel</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageUsers;
