import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpSection() {
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div>
                        <h4 className="mb-2 font-medium">Order Questions</h4>
                        <p className="text-muted-foreground mb-2">
                            Have questions about your order? We&apos;re here to help.
                        </p>
                        <Button variant="outline" size="sm">
                            Contact Support
                        </Button>
                    </div>
                    <div>
                        <h4 className="mb-2 font-medium">Returns & Exchanges</h4>
                        <p className="text-muted-foreground mb-2">
                            30-day return policy on all items. Free returns on orders over
                            $50.
                        </p>
                        <Button variant="outline" size="sm">
                            Start Return
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}