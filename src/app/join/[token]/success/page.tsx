export default function JoinSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="card-title text-2xl mb-4 justify-center">Welcome!</h1>
          <p className="text-lg mb-6">You've successfully joined the campaign!</p>
          <p className="text-sm text-gray-600">
            The campaign owner will be able to see you in their player list and add you to games.
          </p>
        </div>
      </div>
    </div>
  );
}
