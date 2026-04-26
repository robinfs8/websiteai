import { useEffect, useRef, useState } from "react";

const RUNNER_X = 58;
const BODY_SIZE = 30;
const ARENA_HEIGHT = 184;
const GROUND_Y = 150;

function createWorld() {
  return {
    jumpHeight: 0,
    velocity: 0,
    obstacles: [],
    score: 0,
    best: 0,
    speed: 5.4,
    spawnInMs: 860,
    gameOver: false,
    nextObstacleId: 1,
  };
}

function createObstacle(id) {
  const isSpike = Math.random() < 0.6;
  if (isSpike) {
    return { id, kind: "spike", x: 460, width: 24, height: 24, passed: false };
  }
  const tall = Math.random() < 0.38;
  return {
    id,
    kind: "block",
    x: 460,
    width: tall ? 22 : 30,
    height: tall ? 46 : 30,
    passed: false,
  };
}

function collidesWithRunner(obstacle, jumpHeight) {
  const playerLeft = RUNNER_X;
  const playerTop = GROUND_Y - BODY_SIZE - jumpHeight;
  const playerRight = RUNNER_X + BODY_SIZE;
  const playerBottom = playerTop + BODY_SIZE;

  const obstacleLeft = obstacle.x;
  const obstacleTop = GROUND_Y - obstacle.height;
  const obstacleRight = obstacle.x + obstacle.width;
  const obstacleBottom = GROUND_Y;

  return (
    playerLeft < obstacleRight &&
    playerRight > obstacleLeft &&
    playerTop < obstacleBottom &&
    playerBottom > obstacleTop
  );
}

const buttonStyle = {
  border: "1px solid rgba(73,79,223,0.25)",
  background: "#ffffff",
  color: "#1f2937",
  borderRadius: 0,
  padding: "7px 12px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

export default function LoadingOctopusRunner() {
  const worldRef = useRef(createWorld());
  const [view, setView] = useState(() => worldRef.current);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const syncView = () => {
    const world = worldRef.current;
    setView({
      ...world,
      obstacles: world.obstacles.map((obs) => ({ ...obs })),
    });
  };

  const resetGame = () => {
    const best = worldRef.current.best;
    worldRef.current = { ...createWorld(), best };
    syncView();
  };

  const jump = () => {
    const world = worldRef.current;
    if (world.gameOver) {
      resetGame();
      return;
    }
    if (world.jumpHeight <= 0.01) world.velocity = 12.8;
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.key === " " ||
        event.key === "ArrowUp" ||
        event.key === "w" ||
        event.key === "W"
      ) {
        event.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const tickMs = 16;
    const gravity = 0.88;
    const timer = setInterval(() => {
      const world = worldRef.current;
      if (!world.gameOver) {
        world.jumpHeight += world.velocity;
        world.velocity -= gravity;
        if (world.jumpHeight < 0) {
          world.jumpHeight = 0;
          world.velocity = 0;
        }

        world.spawnInMs -= tickMs;
        if (world.spawnInMs <= 0) {
          world.obstacles.push(createObstacle(world.nextObstacleId));
          world.nextObstacleId += 1;
          const baseSpawn = Math.max(520, 930 - world.score * 7);
          world.spawnInMs = baseSpawn + Math.random() * 250;
        }

        world.obstacles = world.obstacles
          .map((obstacle) => ({ ...obstacle, x: obstacle.x - world.speed }))
          .filter((obstacle) => obstacle.x + obstacle.width > -20);

        world.obstacles.forEach((obstacle) => {
          if (!obstacle.passed && obstacle.x + obstacle.width < RUNNER_X) {
            obstacle.passed = true;
            world.score += 1;
            if (world.score > world.best) world.best = world.score;
            world.speed = Math.min(10, 5.4 + world.score * 0.06);
          }
        });

        if (
          world.obstacles.some((obstacle) =>
            collidesWithRunner(obstacle, world.jumpHeight)
          )
        ) {
          world.gameOver = true;
          if (world.score > world.best) world.best = world.score;
        }
      }
      syncView();
    }, tickMs);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        marginTop: 24,
        border: "1px solid rgba(73,79,223,0.25)",
        borderRadius: 0,
        background: "rgba(255,255,255,0.9)",
        padding: 14,
        maxWidth: 460,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 10,
          fontSize: 12,
          color: "#4b5563",
        }}
      >
        <span style={{ fontWeight: 700, color: "#111827" }}>Octopus runner</span>
        <span>
          Score {view.score} • Best {view.best}
        </span>
      </div>

      <div
        role="application"
        aria-label="Octopus jump game"
        onMouseDown={jump}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          const touch = event.changedTouches[0];
          const dx = Math.abs(touch.clientX - touchStartRef.current.x);
          const dy = Math.abs(touch.clientY - touchStartRef.current.y);
          if (dx < 18 && dy < 18) {
            jump();
            return;
          }
          if (dy > dx) jump();
        }}
        style={{
          position: "relative",
          height: ARENA_HEIGHT,
          borderRadius: 0,
          border: "1px solid rgba(73,79,223,0.25)",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(66,135,245,0.12) 0%, rgba(66,135,245,0.03) 66%, rgba(255,255,255,0.96) 100%)",
          touchAction: "manipulation",
          userSelect: "none",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: GROUND_Y,
            height: 2,
            background: "rgba(31,41,55,0.35)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: RUNNER_X,
            top: GROUND_Y - BODY_SIZE - view.jumpHeight,
            width: BODY_SIZE,
            height: BODY_SIZE,
            transform: view.jumpHeight > 1 ? "rotate(-5deg)" : "rotate(0deg)",
            transition: "transform 80ms linear",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 3,
              top: 2,
              width: 24,
              height: 20,
              background: "#2f67ff",
              borderRadius: "50%",
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.2)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 7,
              top: 8,
              width: 4,
              height: 4,
              background: "#ffffff",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 7,
              top: 8,
              width: 4,
              height: 4,
              background: "#ffffff",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 5,
              bottom: 2,
              width: 3,
              height: 8,
              background: "#1f4ddb",
              transform: "rotate(14deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 9,
              bottom: 1,
              width: 3,
              height: 9,
              background: "#1f4ddb",
              transform: "rotate(6deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 13,
              bottom: 1,
              width: 3,
              height: 9,
              background: "#1f4ddb",
              transform: "rotate(-6deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 17,
              bottom: 2,
              width: 3,
              height: 8,
              background: "#1f4ddb",
              transform: "rotate(-14deg)",
            }}
          />
        </div>

        {view.obstacles.map((obstacle) =>
          obstacle.kind === "spike" ? (
            <div
              key={obstacle.id}
              style={{
                position: "absolute",
                left: obstacle.x,
                top: GROUND_Y - obstacle.height,
                width: 0,
                height: 0,
                borderLeft: `${obstacle.width / 2}px solid transparent`,
                borderRight: `${obstacle.width / 2}px solid transparent`,
                borderBottom: `${obstacle.height}px solid #1f2937`,
              }}
            />
          ) : (
            <div
              key={obstacle.id}
              style={{
                position: "absolute",
                left: obstacle.x,
                top: GROUND_Y - obstacle.height,
                width: obstacle.width,
                height: obstacle.height,
                borderRadius: 0,
                background: "#1f2937",
                boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.2)",
              }}
            />
          )
        )}

        {view.gameOver && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              right: 10,
              borderRadius: 0,
              padding: "8px 10px",
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(73,79,223,0.25)",
              fontSize: 12,
              color: "#111827",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Crash! Tap / Space to restart.
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          fontSize: 12,
          color: "#4b5563",
        }}
      >
        <span>Jump with tap, click, Space, W, or ArrowUp.</span>
        <button type="button" onClick={resetGame} style={buttonStyle}>
          Restart
        </button>
      </div>
    </div>
  );
}
