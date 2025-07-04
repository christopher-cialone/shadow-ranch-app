import { useWallet } from "@/hooks/use-wallet";
import { WesternButton } from "@/components/ui/WesternButton";
import { formatWalletAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function WalletButton() {
  const { connected, address, connecting, connect, disconnect } = useWallet();
  const { toast } = useToast();

  const handleClick = async () => {
    if (connected) {
      disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected from Shadow Ranch",
      });
    } else {
      try {
        await connect();
        toast({
          title: "Wallet Connected",
          description: "Welcome to Shadow Ranch, partner!",
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <WesternButton
      onClick={handleClick}
      disabled={connecting}
      variant={connected ? "secondary" : "primary"}
      glow={connected}
      className="relative"
    >
      <i className={`fas ${connected ? 'fa-check-circle' : 'fa-wallet'} mr-2`} />
      {connecting ? (
        <>
          <i className="fas fa-spinner fa-spin mr-2" />
          Connecting...
        </>
      ) : connected ? (
        formatWalletAddress(address)
      ) : (
        "Connect Wallet"
      )}
    </WesternButton>
  );
}
