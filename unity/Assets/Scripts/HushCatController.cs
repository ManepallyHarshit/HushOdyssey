using UnityEngine;

/// <summary>
/// Controls the HushCat player character in the 2D medieval RPG.
/// Handles horizontal movement, jumping, and animation state transitions.
/// </summary>
[RequireComponent(typeof(Rigidbody2D))]
[RequireComponent(typeof(Animator))]
public class HushCatController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 10f;

    [Header("Ground Detection")]
    [SerializeField] private Transform groundCheck;
    [SerializeField] private LayerMask groundLayer;
    [SerializeField] private float groundCheckRadius = 0.2f;

    private Rigidbody2D _rb;
    private Animator _animator;
    private bool _isGrounded;
    private float _horizontalInput;
    private bool _facingRight = true;

    // Animator parameter hashes — caching avoids string lookups every frame
    private static readonly int AnimSpeed   = Animator.StringToHash("Speed");
    private static readonly int AnimIsGround = Animator.StringToHash("IsGrounded");
    private static readonly int AnimJump     = Animator.StringToHash("Jump");

    private void Awake()
    {
        _rb       = GetComponent<Rigidbody2D>();
        _animator = GetComponent<Animator>();
    }

    private void Update()
    {
        _horizontalInput = Input.GetAxisRaw("Horizontal");

        // Flip sprite based on movement direction
        if (_horizontalInput > 0 && !_facingRight) Flip();
        if (_horizontalInput < 0 &&  _facingRight) Flip();

        // Jump input
        if (Input.GetButtonDown("Jump") && _isGrounded)
        {
            _rb.velocity = new Vector2(_rb.velocity.x, jumpForce);
            _animator.SetTrigger(AnimJump);
        }

        // Update animator
        _animator.SetFloat(AnimSpeed,    Mathf.Abs(_horizontalInput));
        _animator.SetBool(AnimIsGround, _isGrounded);
    }

    private void FixedUpdate()
    {
        _isGrounded = Physics2D.OverlapCircle(groundCheck.position, groundCheckRadius, groundLayer);
        _rb.velocity = new Vector2(_horizontalInput * moveSpeed, _rb.velocity.y);
    }

    private void Flip()
    {
        _facingRight = !_facingRight;
        Vector3 scale = transform.localScale;
        scale.x *= -1;
        transform.localScale = scale;
    }
}
